import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { exchangeCodeForToken, getUserInfo } from "../routers/authServer";
import type { AccessToken, TokenResponse, UserInfo } from "../model/authModel";
import { useNavigate, useSearchParams } from "react-router-dom";

export const AuthContent = () => {
  const searchParams = useSearchParams();
  const code = searchParams[0].get("code");
  const router = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    // ถ้าเคยทำงานไปแล้วให้ skip
    if (hasRun.current) return;

    hasRun.current = true; // mark ว่าเคย run แล้ว

    const handleAuth = async () => {
      if (!code) {
        setError("No authentication code provided");
        setIsLoading(false);
        setTimeout(() => router("/"), 2000);
        return;
      }

      setIsLoading(true);

      try {
        const tokenResponse: TokenResponse = await exchangeCodeForToken(code);
        const accessToken: AccessToken = tokenResponse;
        const fetchedUserInfo: UserInfo = await getUserInfo(accessToken);

        if (fetchedUserInfo.cmuitaccount) {
          setUserInfo(fetchedUserInfo);
          if (localStorage.getItem("loginMethod") === "cmu-account-board") {
            setTimeout(() => router("/board/home_board"), 2000);
            return;
          }
          setTimeout(() => router("/home"), 2000);
        } else {
          throw new Error("No cmuitaccount found");
        }
      } catch (error: any) {
        console.error("Token exchange failed:", error);
        setError(error.message || "Failed to authenticate");
        setTimeout(() => router("/"), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    handleAuth();
  }, [code, router]);

  if (isLoading) {
    return (
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-6 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-cyan-900 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin [animation-duration:1.5s]"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          กำลังตรวจสอบการเข้าสู่ระบบ...
        </h2>
        <p className="text-gray-500 text-sm animate-pulse">กรุณารอสักครู่</p>
        <div className="w-3/4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
      </motion.div>
    );
  }

  const hasCmuitaccount = userInfo?.cmuitaccount;
  const headingText = hasCmuitaccount
    ? "กรุณารอสักครู่กำลังตรวจสอบข้อมูล"
    : error
    ? "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
    : "กำลังดำเนินการเข้าสู่ระบบ";
  const subText = hasCmuitaccount
    ? "ดึงข้อมูลสำเร็จ"
    : error
    ? "กรุณาลองใหม่อีกครั้ง"
    : "กรุณารอสักครู่...";

  return (
    <motion.div
      className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-6 max-w-md w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-16 h-16 border-8 border-cyan-900 border-t-transparent rounded-full"></div>
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 border-8 border-cyan-400 border-t-transparent rounded-full opacity-50"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      <motion.div
        className="text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {headingText}
        </h2>
        <motion.p
          className="text-gray-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {subText}
        </motion.p>
      </motion.div>
      {code && (
        <motion.div
          className="bg-gray-100 px-4 py-2 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-sm text-gray-700">
            Code: <span className="font-mono">{code.substring(0, 10)}...</span>
          </p>
        </motion.div>
      )}
      {error && (
        <motion.div
          className="w-full text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            ลองใหม่
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};
