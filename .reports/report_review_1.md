# รายงานรีวิวโค้ดและแผนแก้บั๊ก

วันที่: 2026-05-12
ผู้ตรวจสอบ: automated reviewer

---

## สรุปสั้น ๆ
- ได้อ่านไฟล์ `.reports/report_verify.md` และซอร์สที่เกี่ยวข้อง
- สิ่งที่พบ: ฟังก์ชัน `verifyToken` ใน `src/routers/authServer.tsx` มีการทำ "dedupe" (in-flight cache) แล้ว และ `UserContext` มีการป้องกัน concurrent fetch (ด้วย `inflowRef`) — ดังนั้นปัญหาการเรียก API ซ้ำในระดับเดียวกัน (same tab) ถูกแก้แล้วในโค้ดปัจจุบัน
- ข้อที่ควรปรับ: ความไม่ชัดเจนของรูปแบบข้อมูลที่คืนจาก `verifyToken` (response shape) กับการใช้งานในผู้เรียก (เช่น `UserContext.getUserData`) ซึ่งอาจทำให้สาขาเงื่อนไขผิดพลาดได้ถ้า API/โค้ดไม่สอดคล้องกัน

---

## ไฟล์ที่ตรวจสอบ (mapping)
- `src/routers/authServer.tsx` — นิยาม `verifyToken` (มี inflight dedupe)
- `src/context/UserContext.tsx` — ฟังก์ชัน `getUserData()` (มี `inflowRef`) และเรียก `verifyToken`
- `src/components/Navbar.tsx` — เรียก `getUserData()` แบบมีเงื่อนไข (ใช้ `hasVisible` ref)
- `src/lib/authContent.tsx` — จุดแลกโค้ดเป็น token และดึง user info (เกี่ยวข้องกับ flow การล็อกอิน)
- `.reports/report_verify.md` — รายงานต้นทางที่สรุปปัญหา

> หมายเหตุ: `.reports/report_verify.md` อ้างถึง `src/lib/authContext.tsx` แต่ใน repo ชื่อไฟล์คือ `src/lib/authContent.tsx` (typo ในรายงาน) — แนะนำแก้รายงานหรือแก้ชื่อไฟล์ให้ตรงกัน

---

## ปัญหา & ความเสี่ยงที่พบ
1. รูปแบบข้อมูลไม่สอดคล้อง (response shape)
   - ใน `UserContext.getUserData()` โค้ดตรวจ `response && response.success` และใช้ `response.data` เป็นผู้ใช้งาน
   - ใน `src/routers/authServer.tsx` ฟังก์ชัน `verifyToken` คืนค่า `res.data` โดยตรง (typed เป็น `UserInfo | null`) — ถ้า API คืน `{ success: boolean, data: {...} }` จะยังทำงานได้ แต่ถ้า API คืน user object โดยตรง โค้ดที่ตรวจ `response.success` จะเข้า branch ผิดพลาดและทำ `logout()` โดยไม่จำเป็น
   - ความเสี่ยง: ผู้ใช้ถูกออกจากระบบโดยไม่จำเป็น หรือไม่สามารถตั้งค่า `userData` ให้ถูกต้อง

2. Multi-tab dedupe: `inflightVerify` เป็น cache ต่อ tab เท่านั้น — ถ้าใช้หลายแท็บพร้อมกัน อาจเกิดคำขอซ้ำข้ามแท็บได้ (ความเสี่ยงปานกลาง)

3. รายงาน `.reports` บางจุดล้าสมัย (เช่น แนะนำเพิ่ม dedupe แต่โค้ดมีแล้ว) — ควรอัปเดตเอกสารหลังแก้โค้ด

4. ขาด logging/metrics เฉพาะสำหรับ /role/auth/verify-token (ยากจะติดตามปัญหาใน production)

---

## ข้อเสนอวิธีแก้ (สั้น)
- Quick fix (ระดับสูงสุด — แนะนำทำทันที)
  1. ปรับ `getUserData()` ให้รองรับทั้ง 2 รูปแบบของ `verifyToken` (wrapper `{ success, data }` หรือ raw user object)
     - ตัวอย่างการตรวจที่ทนทาน:

```ts
const response: any = await verifyToken(token);
// รองรับทั้งรูปแบบ { success: boolean, data: User } และ User โดยตรง
const user = response?.success ? response.data : response;
if (!user) {
  logout();
  return;
}
setUserData(user as UserInfoGet);
```

  2. อัปเดต `.reports/report_verify.md` ให้สะท้อนสถานะโค้ดปัจจุบัน (dedupe มีอยู่แล้ว)

- Recommended (สถาปัตยกรรม)
  - Normalize API contract: ให้ `verify-token` คืน `{"success": true, "data": {...}}` เสมอ หรือให้ `verifyToken` wrapper แปลงเป็นรูปแบบที่แอปคาดหวังก่อนคืนค่า
  - หรือให้ `verifyToken` คืนโครงแบบที่ชัดเจน เช่น `{ success: boolean, data?: UserInfoGet }` เพื่อให้ทุก caller ใช้แบบเดียวกัน

- Optional (improvement)
  - ใช้ `BroadcastChannel` หรือ `localStorage` event เพื่อ dedupe ข้ามแท็บถ้าจำเป็น
  - เพิ่ม logging/metric เมื่อเกิดการเรียก `/role/auth/verify-token` (ส่งไปยัง Sentry/Prometheus หรือ at least console.debug)

---

## แผนปฏิบัติ (ขั้นตอนที่แนะนำ — short actionable plan)
1. (ทันที) แก้ `src/context/UserContext.tsx::getUserData()` ให้ทนทานต่อรูปแบบการคืนค่า (apply patch 1)
2. (ทันที) ปรับ `.reports/report_verify.md` หรือเพิ่ม `.reports/report_review_1.md` (ไฟล์นี้) ให้สะท้อนความเป็นจริงและแนะนำการทดสอบ
3. (สำคัญ) รัน manual test:
   - เปิด DevTools → Network → filter `/role/auth/verify-token` → reload → ยืนยันว่าจำนวนคำขอเป็น 1 ต่อ session (per-tab)
   - ทดสอบกรณี login/logout, multiple tabs, refresh
4. (กลาง) ถ้าต้องการ dedupe ข้ามแท็บ ให้ออกแบบและเพิ่ม `BroadcastChannel` coordination
5. (ถัดไป) เพิ่ม logging/metric สำหรับเฝ้าดูอัตราการเรียก

---

## ตัวอย่าง patch ที่แนะนำ (สำหรับ `getUserData`)

```ts
// src/context/UserContext.tsx (ส่วนของ getUserData)
const response: any = await verifyToken(token);
// รองรับ wrapper { success, data } หรือ raw user object
const user = response?.success ? response.data : response;
if (!user) {
  logout();
  return;
}
// existing validation
const organization_code = user.organization_code;
const workstatus = user.status_user;
if (organization_code !== "14" || workstatus !== "active") {
  logout();
  return;
}
setUserData(user as UserInfoGet);
```

---

## การทดสอบ (manual checklist)
- [ ] เปิด DevTools → Network → กรอง `/role/auth/verify-token`
- [ ] Reload หน้าเมื่อ login token อยู่ใน `localStorage` → ควรเห็น 1 request ต่อ reload
- [ ] ทดสอบเปิดสองแท็บพร้อมกัน (same token) → ถ้าต้องการ dedupe ข้ามแท็บ ให้ทดสอบอีกครั้งหลัง implement BroadcastChannel
- [ ] ทดสอบ flow login → redirect → fetch user
- [ ] ทดสอบกรณี token หมดอายุ → แอปควรเรียก `logout()` และรีไดเรกต์

---

## ความสำคัญ (priority)
1. ปรับ `getUserData()` ให้รองรับรูปแบบการคืนค่าที่ต่างกัน (สูง)
2. อัปเดตเอกสาร `.reports` ให้ตรงกับโค้ด (กลาง)
3. เพิ่ม logging/metric สำหรับ `/role/auth/verify-token` (กลาง)
4. (Optional) Deduplicate ข้ามแท็บ (ต่ำ→กลาง ขึ้นกับการใช้งานจริง)

---

## ข้อเสนอถัดไปจากผม
- ผมสามารถ apply patch ด่วนเพื่อแก้ `getUserData()` ให้ทนทานต่อรูปแบบการคืนค่าได้ตอนนี้ (ผมจะแก้ไฟล์ `src/context/UserContext.tsx` และอัปเดต TODOs) — แจ้ง "ให้แก้ตอนนี้" ถ้าต้องการให้ผมลงมือต่อ

---

ไฟล์นี้ถูกสร้างโดย reviewer อัตโนมัติ — ถ้าต้องการให้ผมทำ patch/PR ต่อ ให้ตอบว่าให้ผมแก้ตอนนี้หรือให้แก้แบบอื่น
