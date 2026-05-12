import { motion } from "framer-motion";
import { images } from "../constant";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import packageJson from "../../package.json";
const APP_VERSION = packageJson?.version ?? "0.0.0";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const loginBorad =
      localStorage.getItem("loginMethod") === "cmu-account-board";
    const token = localStorage.getItem("authToken");
    if (!token) navigate("/");
    if (token && loginBorad) navigate("/board/home_board");
  }, []);

  const details = [
    {
      categoryId: "1",
      name: "สำนักงานคณะ",
      part: "/office",
      icon: "🏢",
      description: "บริหารจัดการและสนับสนุนภารกิจคณะ",
      color: "from-blue-500 to-cyan-500",
    },
    {
      categoryId: "2",
      name: "สำนักวิชาสัตวแพทย์",
      part: "/faculty",
      icon: "📚",
      description: "การเรียนการสอนและพัฒนาวิชาการ",
      color: "from-emerald-500 to-teal-500",
    },
    {
      categoryId: "3",
      name: "โรงพยาบาลสัตว์มหาวิทยาลัยเชียงใหม่",
      part: "/hospital",
      icon: "🏥",
      description: "บริการรักษาพยาบาลสัตว์ครบวงจร",
      color: "from-purple-500 to-pink-500",
    },
    {
      categoryId: "4",
      name: "กลุ่มภารกิจยุทธศาสตร์เชิงรุก (บริหารรูปแบบ Sanbox)",
      part: "/sanbox",
      icon: "🚀",
      description: "นวัตกรรมและพัฒนาองค์กรยุคใหม่",
      color: "from-orange-500 to-red-500",
    },
  ];

  const sandboxCenters = [
    "ศูนย์ดูแลสัตว์เลี้ยง (PET CMU)",
    "ศูนย์เฝ้าระวังสุขภาพหนึ่งเดียว (PODD)",
    "ศูนย์ฝึกสัตวแพทย์และฟาร์มทดลอง",
    "ศูนย์ความเป็นเลิศด้านเวชศาสตร์แมว",
    "ศูนย์สัตวแพทย์สาธารณสุขและอาหารปลอดภัย (VPHCAP)",
  ];

  const deptColors = ["#1a56db", "#0d9488", "#7c3aed", "#ea580c"];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="w-full mx-auto  sm:px-0">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4  mb-8 bg-gray-200 py-4 px-5 rounded-b-3xl shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center p-2 flex-shrink-0">
              <img
                src={images.logo}
                alt="มหาวิทยาลัยเชียงใหม่"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                ระบบประเมินผลการปฏิบัติงาน
              </h1>
              <p className="text-sm text-slate-500">
                {localStorage.getItem("loginMethod") === "cmu-account-board"
                  ? "คณะกรรมการตามระเบียบ"
                  : "คณะกรรมการ 360 องศา"}{" "}
                · คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่ · เวอร์ชัน{" "}
                {APP_VERSION}
              </p>
            </div>
          </div>
          <div className="sm:ml-auto flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-600 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              รอบ 1 มิ.ย. 2568 — 31 พ.ค. 2569
            </span>
            <button
              onClick={() =>
                window.open(
                  "https://o365cmu-my.sharepoint.com/:b:/g/personal/sophon_m_cmu_ac_th/ETa7iDkcB9lBlLONG49kP-4BGvwf1txW81Lno1sJm7hadg?e=6Np6fS",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">
                description
              </span>
              สมรรถนะหลัก 1–5
            </button>
          </div>
        </motion.div>

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3"
        >
          เลือกหน่วยงาน
        </motion.p>

        {/* Department cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {details.map((detail, index) => (
            <motion.button
              key={detail.categoryId}
              onClick={() => navigate(detail.part)}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 text-left overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {/* Top accent line */}
              <div
                className="h-0.5"
                style={{ backgroundColor: deptColors[index] }}
              />
              <div className="p-4 sm:p-5 flex items-center gap-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${deptColors[index]}15` }}
                >
                  {detail.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-snug line-clamp-2">
                    {detail.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {detail.description}
                  </p>
                </div>
                <span
                  className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform flex-shrink-0"
                  style={{ color: deptColors[index] + "60" }}
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Sandbox sub-centers */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <span className="text-base">🚀</span>
            <h2 className="text-sm font-semibold text-slate-700">
              ศูนย์ในกลุ่ม Sandbox
            </h2>
            <span className="ml-auto text-xs text-slate-400">
              {sandboxCenters.length} ศูนย์
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100">
            {sandboxCenters.map((center, i) => (
              <div
                key={i}
                className="bg-white px-4 py-3 flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                <span className="text-xs text-slate-600 leading-relaxed">
                  {center}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-6 text-center text-xs text-slate-400"
        >
          © {new Date().getFullYear()} คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่ ·
          v{APP_VERSION}
        </motion.p>
      </div>
    </div>
  );
}
