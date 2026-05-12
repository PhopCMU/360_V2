# ตรวจสอบ `verifyToken` และแผนการแก้ไข

> **สถานะ (2026-05-12): แก้ไขแล้วทั้งหมด — ดูรายละเอียดใน `.reports/report_review_1.md`**

สรุปการตรวจสอบ (ข้อค้นพบ)
- ฟังก์ชัน `verifyToken` ถูกนิยามที่: `src/routers/authServer.tsx`.
- เรียกใช้งานที่: `src/context/UserContext.tsx` และ `src/lib/authContext.tsx`.
- ขณะนี้แอปหลัก (`src/main.tsx`) ใช้เฉพาะ `UserProvider` (ไม่พบการใช้งาน `AuthProvider`) แต่ยังมีการเรียก `getUserData()` จาก `Navbar` ซึ่งทำให้มีความเป็นไปได้ที่จะเกิดการเรียก `verifyToken` ซ้ำ (เช่น: `UserProvider` เรียกตอน mount และ `Navbar` อาจเรียกอีกครั้งใน useEffect)

ผลกระทบ
- เรียก API ตรวจสอบ token ซ้ำซ้อน → โหลดเครือข่ายเพิ่ม, ความล่าช้า, และความเสี่ยง race condition

แผนการแก้ไข (ขั้นตอนปฏิบัติ)
> ✅ ดำเนินการแล้วทั้งหมดใน `src/context/UserContext.tsx` และ `src/routers/authServer.tsx`

1) ยืนยัน (Reproduce & Measure)
	- เปิด DevTools → Network → ฟิลเตอร์ที่ `/role/auth/verify-token` แล้ว reload หน้าเพื่อดูจำนวนคำขอ
	- เพื่อดีบักเพิ่มเติม ให้ชั่วคราวใส่ `console.log` ใน `verifyToken` เพื่อดูการเรียกพร้อม timestamp

2) ตัดสินแนวทางแก้ (สองแนวทางให้เลือก)
	- Option A — Centralize (แนะนำ)
		- ให้มี Provider เดียวเป็นแหล่งความจริง (เช่น `UserProvider`) และลบ/ไม่ใช้ `AuthProvider` ใน tree
		- ปรับ component ที่ปัจจุบันเรียก `getUserData()` เอง (เช่น `Navbar`) ให้พึ่ง `userData` จาก context โดยตรง แทนการเรียก fetch อัตโนมัติบน mount
		- ทำให้ `getUserData()` เป็น idempotent ด้วยตัวล็อกภายใน (ดูข้อ 3)
	- Option B — Dedupe ในระดับฟังก์ชัน `verifyToken` (เร็วและปลอดภัย)
		- เพิ่มการ dedupe ของคำขอที่กำลังดำเนินการอยู่ (in-flight) โดยเก็บเป็น Map<token, Promise>
		- ถ้ามีคำขอเดียวกันระหว่างการเรียกหลายครั้ง ให้คืน Promise ตัวเดียวกันแทนการส่งคำขอซ้ำ

3) Implementation (ตัวอย่างโค้ดแนะนำ)
- ใน `src/routers/authServer.tsx` (dedupe แบบ Option B):

```ts
const inflightVerify = new Map<string, Promise<any|null>>();

export const verifyToken = async (token: string): Promise<any | null> => {
	if (!token) return null;
	const existing = inflightVerify.get(token);
	if (existing) return existing;

	const p = axios
		.get(`${configs.URL_API}/role/auth/verify-token`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then(res => res.data)
		.catch(err => {
			console.error("Token verification failed:", err?.message ?? err);
			return null;
		})
		.finally(() => inflightVerify.delete(token));

	inflightVerify.set(token, p);
	return p;
};
```

- ใน `src/context/UserContext.tsx` (ป้องกัน concurrent fetch ภายใน context — Option A / complementary):

```ts
const inflowRef = useRef(false);

const getUserData = useCallback(async () => {
	if (inflowRef.current) return;
	inflowRef.current = true;
	try {
		// existing logic...
	} finally {
		inflowRef.current = false;
	}
}, [logout]);
```

4) ทดสอบ
	- ทำตามขั้นตอนใน (1) เพื่อตรวจสอบว่า reload แล้วเกิดเพียงคำขอเดียวต่อ token
	- ทดสอบกรณี login/logout, multiple tabs, และการรีเฟรชหน้า

5) ปล่อยและติดตาม
	- ทำ code review และ merge
	- ติดตั้ง logging/metrics (ถ้ามี) เพื่อเฝ้าดูอัตราการเรียก `/verify-token`

ข้อเสนอแนะเพิ่มเติม
- ถ้าต้องการผลลัพธ์ทันทีและง่ายที่สุด ให้ทำ Option B (dedupe) เพราะไม่ต้องเปลี่ยนโครงสร้าง provider มาก
- ถ้าต้องการออกแบบสถาปัตยกรรมที่ชัดเจนและง่ายต่อการดูแล ให้เลือก Option A (single source of truth for auth)

ผู้ดำเนินการที่แนะนำ: ทีม frontend (แก้ `UserContext` / `Navbar`) และทีมช่วยปรับ `authServer.tsx` ถ้าทำ dedupe

หมายเลขอ้างอิงการค้นหา:
- `src/routers/authServer.tsx` — นิยาม `verifyToken`
- `src/context/UserContext.tsx` — เรียก `verifyToken` (via `getUserData()`)
- `src/lib/authContext.tsx` — เรียก `verifyToken` (มีแต่ยังไม่ถูก mount ใน `main.tsx`)

--- 
รายงานนี้สร้างโดยเครื่องมือช่วยตรวจสอบโค้ด — หากต้องการผมช่วยแก้โค้ดให้ทันที แจ้งแนวทางที่ต้องการ (Option A หรือ B) แล้วผมจะดำเนินการต่อและอัปเดต TODOs ที่เกี่ยวข้อง

