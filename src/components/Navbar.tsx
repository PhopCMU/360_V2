import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasVisible = useRef(false);
  const navigate = useNavigate();
  const { userData, getUserData } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && !userData) {
      if (hasVisible.current) return;
      getUserData();
      hasVisible.current = true;
    }
  }, [userData, getUserData]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    if (localStorage.getItem("loginMethod") === "cmu-account-board") {
      localStorage.removeItem("authToken");
      navigate("/board");
    } else {
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  const navLinks = [
    { path: "/home", name: "เลือกการประเมิน", icon: "assignment" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={` top-0 w-full z-50  bg-[#0f2557] py-3 px-4 shadow-lg ${
          scrolled
            ? "bg-[#0f2557] py-3 px-4 shadow-lg"
            : "bg-[#0f2557] py-3 px-4 shadow-lg"
        }`}
      >
        <div className="w-full mx-auto flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden ${
                  scrolled
                    ? "bg-[#0f2557]"
                    : "bg-white/15 backdrop-blur-sm border border-white/10"
                }`}
              >
                <span className="material-symbols-outlined text-sm text-white">
                  psychology
                </span>
              </div>
            </motion.div>

            {/* Desktop User Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block"
            >
              {userData && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium ${
                        scrolled ? "text-slate-500" : "text-white/60"
                      }`}
                    >
                      ยินดีต้อนรับ
                    </span>
                    <div
                      className={`w-1 h-1 rounded-full ${
                        scrolled ? "bg-gray-300" : "bg-white/50"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        scrolled ? "text-blue-600" : "text-white/70"
                      }`}
                    >
                      {localStorage.getItem("loginMethod") ===
                      "cmu-account-board"
                        ? "คณะกรรมการตามระเบียบ"
                        : "คณะกรรมการ 360 องศา"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h1
                      className={`text-sm font-bold ${
                        scrolled ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {userData?.firstname_TH} {userData?.lastname_TH}
                    </h1>
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                        scrolled
                          ? "bg-blue-50 text-blue-700"
                          : "bg-white/15 text-white/90"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        badge
                      </span>
                      <span>ผู้ใช้งาน</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Mobile User Greeting */}
            {userData && (
              <div className="lg:hidden">
                <div
                  className={`text-sm font-medium flex flex-col truncate max-w-[120px] ${
                    scrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  {userData?.firstname_TH}
                  <div
                    className={`text-xs ${
                      scrolled ? "text-gray-500" : "text-white/80"
                    }`}
                  >
                    {localStorage.getItem("loginMethod") === "cmu-account-board"
                      ? "คณะกรรมการตามระเบียบ"
                      : "คณะกรรมการ 360 องศา"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Date Display */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                scrolled
                  ? "bg-gray-100 text-gray-600 border border-gray-200"
                  : "bg-white/10 text-white backdrop-blur-sm"
              }`}
            >
              <span className="material-symbols-outlined text-base">
                calendar_month
              </span>
              <span className="text-sm font-medium whitespace-nowrap">
                {new Date()
                  .toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/[^ก-ฮ0-9\s]/g, "")}
              </span>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className="relative">
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-3 py-2 rounded-lg transition-all ${
                        isActive
                          ? scrolled
                            ? "text-indigo-600 bg-indigo-50"
                            : "text-white bg-white/20"
                          : scrolled
                            ? "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl">
                          {link.icon}
                        </span>
                        <span className="text-sm font-medium">{link.name}</span>
                      </div>
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-4 py-2 rounded-lg font-medium flex items-center gap-2 overflow-hidden group ${
                scrolled
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg"
                  : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
              }`}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  logout
                </span>
                <span className="text-sm hidden sm:inline">ออกจากระบบ</span>
              </span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Date Icon */}
            <div
              className={`p-2 rounded-lg ${
                scrolled ? "bg-gray-100" : "bg-white/10"
              }`}
            >
              <span
                className={`material-symbols-outlined text-base ${
                  scrolled ? "text-gray-600" : "text-white"
                }`}
              >
                calendar_month
              </span>
            </div>

            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg ${
                scrolled
                  ? "bg-gray-100 text-gray-700"
                  : "bg-white/10 text-white"
              }`}
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden mt-2 rounded-xl overflow-hidden ${
                scrolled
                  ? "bg-white border border-gray-100 shadow-lg"
                  : "bg-white/95 backdrop-blur-xl"
              }`}
            >
              <div className="p-3 space-y-2">
                {/* User Info in Mobile */}
                {userData && (
                  <div
                    className={`p-3 rounded-lg mb-2 ${
                      scrolled ? "bg-indigo-50" : "bg-indigo-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-indigo-600 text-sm">
                        account_circle
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {userData?.firstname_TH} {userData?.lastname_TH}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {localStorage.getItem("loginMethod") ===
                      "cmu-account-board"
                        ? "คณะกรรมการตามระเบียบ"
                        : "คณะกรรมการ 360 องศา"}
                    </div>
                  </div>
                )}

                {/* Mobile Navigation Links */}
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {({ isActive }) => (
                        <div
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                              : scrolled
                                ? "text-gray-700 hover:bg-gray-100"
                                : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {link.icon}
                          </span>
                          <span className="text-sm font-medium">
                            {link.name}
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </motion.div>
                ))}

                {/* Mobile Logout Button */}
                <motion.button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white mt-2"
                >
                  <span className="material-symbols-outlined text-xl">
                    logout
                  </span>
                  <span className="text-sm font-medium">ออกจากระบบ</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
