import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { images } from "../constant";

import { AuthServiceCmu } from "../routers/authServer";

const LoginPage = () => {
  // const [loginMethod] = useState("cmu-account");
  // const [credentials, setCredentials] = useState({
  //   cmuaccount: "",
  // });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: { opacity: 1, y: 0 },
  //   hover: {
  //     y: -5,
  //     boxShadow:
  //       "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  //     transition: { duration: 0.3 },
  //   },
  // };

  const authUrlBase = import.meta.env.VITE_AUTH_URL ?? "";
  const clientId = import.meta.env.VITE_CLIENT_ID ?? "";
  const redirectUri = import.meta.env.VITE_REDIRECT_URI ?? "";
  const scope = import.meta.env.VITE_SCOPE ?? "";
  const responseType = "code";

  // const handleLoginCmuEmail = async (e: React.FormEvent) => {
  //   e.preventDefault();

  // };

  const handleLoginCmuAccount = async () => {
    setIsLoading(true); // Show loading modal
    try {
      await AuthServiceCmu({
        authUrlBase,
        clientId,
        redirectUri,
        scope,
        responseType,
      });
      localStorage.setItem("loginMethod", "cmu-account-board");
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setIsLoading(false); // Hide loading modal (though this may not be reached due to redirect)
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setCredentials((prev) => ({ ...prev, [name]: value }));
  // };

  return (
    <div className="min-h-screen bg-[#0f2557] flex items-center justify-center py-8 sm:py-12 px-3 sm:px-4 lg:px-8 relative overflow-hidden">
      {/* Geometric background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full border border-white/[0.03]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-teal-500/5" />
        <svg
          className="absolute top-0 left-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl relative z-10"
      >
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row min-h-[560px]">
            {/* Left Panel — Brand Hero */}
            <div className="lg:w-[45%] bg-[#0f2557] p-8 sm:p-10 lg:p-12 text-white relative overflow-hidden flex flex-col justify-between">
              {/* subtle teal glow bottom-left */}
              <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full border border-white/5 -mr-20 -mt-20 pointer-events-none" />

              <div className="relative z-10">
                {/* Logo + org */}
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-10"
                >
                  <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-sm border border-white/10">
                    <img
                      src={images.logo}
                      alt="มหาวิทยาลัยเชียงใหม่"
                      className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-white/60 uppercase tracking-widest">
                      คณะสัตวแพทยศาสตร์
                    </p>
                    <p className="text-sm font-semibold text-white/90">
                      มหาวิทยาลัยเชียงใหม่
                    </p>
                  </div>
                </motion.div>

                {/* System title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                >
                  <div className="inline-flex items-center gap-2 bg-teal-500/15 border border-teal-400/20 rounded-full px-3 py-1 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-xs text-teal-300 font-medium">
                      ระบบเปิดให้บริการ
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-tight mb-3">
                    ระบบประเมิน
                    <br />
                    <span className="text-teal-300">คณะกรรมการตามระเบียบ</span>
                  </h1>
                  <p className="text-sm text-white/55 leading-relaxed max-w-xs">
                    พัฒนาศักยภาพบุคลากรด้วยการประเมินที่รอบด้าน โปร่งใส
                    และเป็นธรรม
                  </p>
                </motion.div>
              </div>

              {/* Feature list */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative z-10 mt-8 space-y-2.5"
              >
                {[
                  "ประเมินได้มากกว่า 1 คน",
                  "ข้อมูลปลอดภัยและเป็นความลับ",
                  "ผลการประเมินที่แม่นยำ รอบด้าน",
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm text-white/70"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-400/20 border border-teal-400/30 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-teal-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    {feat}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Panel — Login */}
            <div className="lg:w-[55%] p-8 sm:p-10 lg:p-12 bg-white flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                  ยินดีต้อนรับ
                </h2>
                <p className="text-slate-500 text-sm mb-8">
                  กรุณาเข้าสู่ระบบด้วยบัญชี CMU เพื่อดำเนินการต่อ
                </p>

                {/* CMU Info Box */}
                <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8">
                  <span className="material-symbols-outlined text-slate-400 text-xl mt-0.5">
                    info
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-0.5">
                      CMU IT ACCOUNT
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      ใช้ CMU E-Mail และ Password เดียวกันกับระบบ CMU MIS (ONE
                      IT ACCOUNT TO ALL CMU SERVICES)
                    </p>
                  </div>
                </div>

                {/* Login Button */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleLoginCmuAccount}
                    disabled={isLoading}
                    aria-busy={isLoading}
                    className={`w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl font-semibold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
                      isLoading
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-[#1a56db] text-white hover:bg-[#1648c0] hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>กำลังเชื่อมต่อ...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl">
                          account_circle
                        </span>
                        <span>เข้าสู่ระบบด้วยบัญชี CMU</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      (location.href = import.meta.env.VITE_LOGOUT_URL ?? "")
                    }
                    className="w-full py-3 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                  >
                    ออกจากระบบ Microsoft Online
                  </button>
                </div>

                {/* Security badges */}
                <div className="flex items-center justify-center gap-5 mt-8 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    SSL Encrypted
                  </div>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    มาตรฐาน CMU
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default LoginPage;
