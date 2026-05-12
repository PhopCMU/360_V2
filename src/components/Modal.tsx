import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

interface LoadingModalProps {
  isOpen: boolean;
  progress: number;
  isError?: boolean;
  errorMessage?: string;
}

// กำหนดประเภทของ props
interface ModalAlertProps {
  onClose: () => void;
  details: string;
}

const overlayVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(4px)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const modalVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
      duration: 0.3,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.15 },
  },
};

const ElegantSpinner = ({ className = "h-10 w-10" }) => (
  <motion.div
    className={className}
    animate={{ rotate: 360 }}
    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
  >
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient
          id="spinnerGradientModalUnique"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: "#b18246", stopOpacity: 1 }} />
          <stop
            offset="50%"
            style={{ stopColor: "#8e602e", stopOpacity: 0.7 }}
          />{" "}
          <stop
            offset="100%"
            style={{ stopColor: "#502916", stopOpacity: 0.3 }}
          />
        </linearGradient>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#spinnerGradientModalUnique)"
        strokeWidth="8"
        fill="none"
        strokeDasharray="180"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>
);

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  progress,
  isError,
  errorMessage,
}) => {
  if (!isOpen) return null;
  const [animatedDots, setAnimatedDots] = useState("");

  useEffect(() => {
    let intervalId: any;
    if (!isError) {
      intervalId = setInterval(() => {
        setAnimatedDots((prev) => {
          if (prev.length >= 3) return ".";
          return prev + ".";
        });
      }, 400);
    } else {
      setAnimatedDots("");
    }
    return () => clearInterval(intervalId);
  }, [isError]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#185484]/90 to-[#0f3a5b]/90 backdrop-blur-md font-inter antialiased"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
        className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl w-full mx-4 sm:mx-6 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl border border-white/20 relative overflow-auto max-h-[90vh]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <motion.div
            className="absolute -top-20 -left-20 w-40 h-40 bg-[#b18246]/30 rounded-full filter blur-xl" // Gold blurred circle
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#502916]/30 rounded-full filter blur-xl" // Dark brown blurred circle
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.7,
            }}
          />
        </div>

        <div className="relative z-10 overflow-auto max-h-[82vh]">
          <div className="flex flex-col items-center mb-6">
            {isError ? (
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-[#b18246]/20 rounded-full flex items-center justify-center mb-4">
                <ElegantSpinner className="h-10 w-10" />
              </div>
            )}

            <h3 className="text-2xl font-bold text-white tracking-wide">
              {isError ? "เกิดข้อผิดพลาด" : "กำลังบันทึกข้อมูล"}
            </h3>
          </div>

          {!isError ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="w-full bg-white/20 rounded-full h-3.5 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="bg-gradient-to-r from-[#b18246] via-[#8e602e] to-[#502916] h-full rounded-full shadow-lg"
                  />

                  {progress > 0 && progress < 100 && (
                    <motion.div
                      className="absolute top-0 left-0 h-full w-1/5 bg-white/20"
                      style={{ filter: "blur(3px)" }}
                      initial={{ x: "-100%" }}
                      animate={{ x: "500%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                </div>

                <div className="flex justify-between text-sm text-white/80">
                  <span>กำลังดำเนินการ{animatedDots}</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
              </div>

              <p className="text-white/70 text-sm text-center">
                กรุณารอสักครู่ ระบบกำลังประมวลผลข้อมูลของคุณ
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/30">
                <p className="text-red-200 font-medium text-center">
                  {errorMessage || "ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()} // Reloads the page on click
                  aria-label="ลองใหม่"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 flex items-center justify-center group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 transform transition-transform duration-300 group-hover:rotate-[-180deg]" // Icon rotates on button hover
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  ลองใหม่
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Generic wrapper for simple accessible modals (overlay, ESC, click-outside)
const ModalWrapper: React.FC<{
  onClose?: () => void;
  className?: string;
  labelledBy?: string;
  describedBy?: string;
  children?: React.ReactNode;
}> = ({ onClose, className, labelledBy, describedBy, children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!onClose) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    // focus container for keyboard users
    containerRef.current?.focus();
  }, []);

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={(e) => {
        // close when clicking outside the dialog
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        variants={modalVariants}
        ref={containerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={`rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-auto border ${
          className ??
          "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50"
        }`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const ModalSuccess: React.FC<ModalAlertProps> = ({
  onClose,
  details,
}) => {
  const titleId = "modal-success-title";
  const descId = "modal-success-desc";
  return (
    <ModalWrapper onClose={onClose} labelledBy={titleId} describedBy={descId}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <div className="bg-green-500/20 p-2 rounded-full mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h3 id={titleId} className="text-xl font-semibold text-white">
              ดำเนินการสำเร็จ
            </h3>
            <p id={descId} className="text-gray-300 mt-1 text-sm">
              {details}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="ปิด"
          className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="h-1 bg-gray-700 rounded-full mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.6, ease: "linear" }}
          className="h-full bg-green-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-green-500/20 focus:outline-none focus:ring-2 focus:ring-green-500/50"
        >
          ตกลง
        </button>
      </div>
    </ModalWrapper>
  );
};

export const ModalWarn: React.FC<ModalAlertProps> = ({ onClose, details }) => {
  const titleId = "modal-warn-title";
  const descId = "modal-warn-desc";
  return (
    <ModalWrapper
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descId}
      className="border-yellow-500/30 bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <div className="bg-yellow-500/20 p-2 rounded-full mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div>
            <h3 id={titleId} className="text-xl font-semibold text-yellow-400">
              คำเตือน
            </h3>
            <div id={descId} className="mt-1 text-sm text-gray-300">
              {details.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="ปิด"
          className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
        className="h-1 bg-yellow-500/30 rounded-full mb-4"
      />

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        >
          ตกลง
        </button>
      </div>
    </ModalWrapper>
  );
};
