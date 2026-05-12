import { useEffect, useRef, useState, memo, useCallback } from "react";
import Navbar from "../../../components/Navbar";
import { fetchDataAgency } from "../../../routers/GetRouter";
import type { User } from "../../../model/authModel";
import { Menus_board, Tabs } from "./../menus";
import DropdownSelect from "../../../components/DropdownSelect";
import {
  LoadingModal,
  ModalSuccess,
  ModalWarn,
} from "../../../components/Modal";
import { ScoreRouterBoardCryptoJS } from "../../../routers/PostRouter";
import CryptoJS from "crypto-js";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { configs } from "../../../config/conf";
import { UserIcon } from "lucide-react";

interface ScoreData {
  [key: string]: {
    [term: string]: string; // เช่น "1": "5"
    comment?: any;
  };
}

// Memoized Card Component to prevent stuttering
const UserCard = memo(
  ({
    user,
    isChecked,
    currentComment,
    scores,
    points,
    onToggle,
    onUpdateScore,
    onUpdateComment,
    onApplyTarget,
  }: {
    user: any;
    isChecked: boolean;
    currentComment: string;
    scores: any;
    points: any[];
    onToggle: (id: string, name: string) => void;
    onUpdateScore: (id: string, term: string, value: string) => void;
    onUpdateComment: (id: string, value: string) => void;
    onApplyTarget: (id: string, fullname_th: string) => void;
  }) => {
    return (
      <div
        className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-200 ${
          isChecked
            ? "ring-2 ring-teal-500 ring-offset-2 shadow-lg"
            : "shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300"
        }`}
      >
        {/* Checkbox */}
        <div className="absolute top-3 right-3 z-20">
          <label
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors duration-200 shadow-sm ${isChecked ? "bg-teal-500 border-teal-500" : "bg-white/90 border-white backdrop-blur-sm"}`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(user.accountId, user.fullname_th)}
              aria-label={`เลือก ${user.fullname_th}`}
              className="sr-only"
            />
            {isChecked && (
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </label>
        </div>

        {/* Card image — clickable to select */}
        <div
          onClick={() => onToggle(user.accountId, user.fullname_th)}
          className="relative h-48 sm:h-60 bg-slate-100 overflow-hidden cursor-pointer"
          role="button"
          aria-label={`${isChecked ? "ยกเลิกเลือก" : "เลือก"} ${user.fullname_th}`}
        >
          {user.imageprofile ? (
            <img
              src={(configs.URL_API + user.imageprofile) as string}
              className="w-full h-full object-contain object-top transition-transform duration-300 group-hover:scale-105"
              alt={user.fullname_th}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
              <UserIcon
                size={56}
                strokeWidth={0.5}
                className="text-slate-300"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <h3 className="text-white font-semibold text-sm sm:text-base leading-snug truncate">
              {user.fullname_th}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-white/60 text-[10px] sm:text-xs flex items-center gap-0.5">
                <span
                  className="material-symbols-outlined text-[11px]"
                  aria-hidden="true"
                >
                  fingerprint
                </span>
                {user.accountId}
              </span>
              {user.nickname && (
                <span className="bg-white/15 text-white text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded">
                  {user.nickname}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Score label row (with apply-target button) */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              การประเมิน
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onApplyTarget(user.accountId, user.fullname_th)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-white border border-slate-200 text-teal-600 hover:bg-teal-50 transition-colors"
                aria-label={`เติมคะแนนตามเป้าสำหรับ ${user.fullname_th}`}
              >
                <span
                  className="material-symbols-outlined text-sm"
                  aria-hidden="true"
                >
                  done_all
                </span>
                <span className="hidden sm:inline">กดเพื่อให้คะแนนตาม KPI</span>
              </button>
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded-md">
                เต็ม 5
              </span>
            </div>
          </div>

          {/* Score inputs grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((term) => {
              const value = scores?.[String(term)] ?? "";
              const expectationPoint = points[term - 1]?.point || "-";
              return (
                <div key={term} className="space-y-1">
                  <div className="relative">
                    <input
                      disabled={!isChecked}
                      type="number"
                      min="0"
                      max="5"
                      value={value}
                      aria-label={`สมรรถนะที่ ${term}`}
                      onChange={(e) => {
                        const val = e.target.value;
                        let num: any = parseFloat(val);
                        if (isNaN(num)) num = "";
                        else if (num > 5) num = 5;
                        else if (num < 0) num = 0;
                        onUpdateScore(
                          user.accountId,
                          String(term),
                          String(num),
                        );
                      }}
                      className={`w-full h-9 sm:h-10 text-center text-sm font-bold rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${
                        isChecked
                          ? "bg-white border-slate-200 text-teal-700 focus:border-teal-400"
                          : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                      }`}
                    />
                    <span className="absolute -top-1.5 -left-1 w-4 h-4 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-[12px] font-bold text-slate-500">
                      {term}
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-[12px] text-teal-700 font-medium uppercase">
                      KPI
                    </span>
                    <span className="text-[12px] font-bold text-teal-700 bg-slate-50 px-1 py-0.5 rounded">
                      {expectationPoint}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comment */}
          <div>
            <textarea
              disabled={!isChecked}
              value={currentComment}
              onChange={(e) => onUpdateComment(user.accountId, e.target.value)}
              placeholder="ข้อเสนอแนะ..."
              rows={2}
              maxLength={1000}
              aria-label={`ข้อเสนอแนะสำหรับ ${user.fullname_th}`}
              className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400/40 ${
                isChecked
                  ? "bg-white border-slate-200 focus:border-teal-400"
                  : "bg-slate-50 border-transparent text-slate-300 cursor-not-allowed"
              }`}
            />
            {isChecked && (
              <div className="flex justify-end mt-1">
                <span className="text-[9px] font-medium text-slate-400">
                  {currentComment.length} / 1000
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default function OfficeBoardPage() {
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState<string>(
    Tabs.map((tab) => tab.key)[0] || "นักการเงินและบัญชี",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [checkedRows, setCheckedRows] = useState<
    Set<{ accountId: string; fullname_th: string }>
  >(new Set());
  const [dataUser, setDataUser] = useState<User[]>([]);
  const [scoresData, setScoresData] = useState<ScoreData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarnModal, setShowWarnModal] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCompetenciesOpen, setIsCompetenciesOpen] = useState(true);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const loginBorad =
      localStorage.getItem("loginMethod") === "cmu-account-board";
    const token = localStorage.getItem("authToken");
    if (!token) navigate("/board");
    if (token && !loginBorad) navigate("/office");
  }, []);

  const fetchDataUser = async () => {
    const agencyString = "สำนักงานคณะ";
    try {
      const response = await fetchDataAgency(agencyString);
      if (response.success) {
        setDataUser(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:");
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    fetchDataUser();
    hasFetched.current = true;
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  // กรองข้อมูลตาม Tab, Group และ Search Query
  const filteredUsers = dataUser.filter((user) => {
    const matchesTab = user.positiontitle_th === activeTab;

    const matchesSearch =
      !searchQuery ||
      Object.values(user).some(
        (val: any) =>
          val &&
          typeof val === "string" &&
          val.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesTab && matchesSearch;
  });

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    // Reset to first page when filters/search change
    setCurrentPage(1);
  }, [searchQuery, activeTab, filteredUsers.length]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  // ดึง points จาก Tabs ตาม activeTab
  const currentTab = Tabs.find((tab) => tab.key === activeTab);
  const points = currentTab?.points || [];

  const toggleRow = useCallback((accountId: string, fullname_th: string) => {
    setCheckedRows((prev) => {
      const newCheckedRows = new Set(prev);
      const row = { accountId, fullname_th };
      // Check if row exists by comparing accountId (since object references differ)
      const rowExists = Array.from(newCheckedRows).some(
        (r: any) => r.accountId === accountId,
      );
      if (rowExists) {
        newCheckedRows.forEach((r: any) => {
          if (r.accountId === accountId) newCheckedRows.delete(r);
        });
        setScoresData((prev) => {
          const { [accountId]: _, ...rest } = prev;
          return rest;
        });
      } else {
        newCheckedRows.add(row);
        setScoresData((prev) => ({
          ...prev,
          [accountId]: {
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "",
            8: "",
            9: "",
            comment: "", // Initialize comment
          },
        }));
      }
      return newCheckedRows;
    });
  }, []);

  const updateScore = useCallback(
    (accountId: string, term: string, value: string) => {
      const numericValue = parseFloat(value);
      let finalValue = value;

      if (numericValue > 5) {
        finalValue = "5";
      } else if (numericValue < 0) {
        finalValue = "0";
      }

      setScoresData((prev: any) => ({
        ...prev,
        [accountId]: {
          ...(prev[accountId] || {}),
          [term]: finalValue,
        },
      }));
    },
    [],
  );

  const updateComment = useCallback((accountId: string, value: string) => {
    setScoresData((prev) => ({
      ...prev,
      [accountId]: {
        ...(prev[accountId] || {}),
        comment: value,
      },
    }));
  }, []);

  // เติมคะแนนตามเป้าสำหรับผู้ใช้แต่ละคน (จะเพิ่มผู้ใช้ในชุดที่ถูกเลือกด้วย)
  const applyTargetScores = useCallback(
    (accountId: string, fullname_th: string) => {
      setCheckedRows((prev) => {
        const newCheckedRows = new Set(prev);
        const exists = Array.from(newCheckedRows).some(
          (r: any) => r.accountId === accountId,
        );
        if (!exists) newCheckedRows.add({ accountId, fullname_th });
        return newCheckedRows;
      });

      setScoresData((prev) => {
        const next: any = { ...prev };

        // Find the user to determine their position (for when activeTab is "ทั้งหมด")
        const user = dataUser.find((u) => u.accountId === accountId);
        const userPosition = user?.positiontitle_th;
        const tabForUser = Tabs.find((t) => t.key === userPosition);
        const targetPoints = tabForUser?.points || points;

        const newScores: any = {};
        for (let i = 0; i < 9; i++) {
          const term = String(i + 1);
          const expectationPoint = targetPoints[i]?.point;
          newScores[term] =
            expectationPoint !== undefined && expectationPoint !== null
              ? String(expectationPoint)
              : "";
        }
        newScores.comment = prev[accountId]?.comment || "";
        next[accountId] = {
          ...(prev[accountId] || {}),
          ...newScores,
        };
        return next;
      });
    },
    [points, dataUser],
  );

  // ส่งคะแนนไป
  const handleSendScores = async () => {
    if (checkedRows.size === 0) {
      setShowWarnModal("กรุณาเลือกอย่างน้อยหนึ่งรายการก่อนส่งข้อมูล");
      return;
    }

    try {
      // ตรวจสอบทุก row ใน checkedRows ว่ามี scores ครบ 9 คีย์และมีค่าไม่ว่าง และ comment ว่าง
      const incompleteScores = Array.from(checkedRows).find((row) => {
        const scores = scoresData[row.accountId];
        const isScoresInvalid =
          !scores ||
          typeof scores !== "object" ||
          !["1", "2", "3", "4", "5", "6", "7", "8", "9"].every(
            (key) =>
              key in scores &&
              scores[key] !== undefined &&
              scores[key] !== "" &&
              scores[key] !== null,
          );
        return isScoresInvalid;
      });

      if (incompleteScores) {
        setShowWarnModal(`
          กรุณากรอกข้อมูลให้ครบก่อนส่ง
          ชื่อ: ${incompleteScores.fullname_th || "ไม่พบชื่อ"}
          Account ID: ${incompleteScores.accountId}
          ปัญหา: คะแนนไม่ครบ 9 รายการ
        `);
        return;
      }

      // สร้าง object สำหรับ encrypt
      const dataToEncrypt = Array.from(checkedRows).map((row: any) => ({
        accountId: row.accountId,
        fullname_th: row.fullname_th,
        assessor: `${userData?.frirstname_TH} ${userData?.lastname_TH}`,
        scores: scoresData[row.accountId],
        comment: scoresData[row.accountId]?.comment || "",
      }));

      // ตรวจสอบว่า dataToEncrypt มีข้อมูลหรือไม่
      if (dataToEncrypt.length === 0) {
        setShowWarnModal(
          "ไม่พบข้อมูลที่ถูกต้องสำหรับการส่ง กรุณาตรวจสอบ scores และข้อมูลผู้ใช้",
        );
        return;
      }

      if (dataToEncrypt.length > 1) {
        const invalidScores = dataToEncrypt.find((item) => {
          const scores = item.scores;
          const isScoresInvalid =
            !scores ||
            typeof scores !== "object" ||
            !["1", "2", "3", "4", "5", "6", "7", "8", "9"].every(
              (key) =>
                key in scores &&
                scores[key] !== undefined &&
                scores[key] !== "" &&
                scores[key] !== null,
            );
          return isScoresInvalid;
        });

        if (invalidScores) {
          setShowWarnModal(`
            กรุณากรอกข้อมูลให้ครบก่อนส่ง
            ชื่อ: ${invalidScores.fullname_th || "ไม่พบชื่อ"}
            Account ID: ${invalidScores.accountId}
            ปัญหา: คะแนนไม่ครบ 9 รายการ
          `);
          return;
        }
      }

      // ตั้งค่าสถานะเริ่มต้น
      setIsLoading(true);
      setIsError(false);
      setErrorMessage("");
      setUploadProgress(0);

      // เข้ารหัสข้อมูล
      const secretKey = import.meta.env.VITE_SECRET_KEY_CRYPTO_FRONTEND;
      if (!secretKey) {
        throw new Error("ไม่พบคีย์สำหรับเข้ารหัสข้อมูล");
      }
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(dataToEncrypt),
        secretKey,
      ).toString();

      // ส่งข้อมูลไปยัง API
      const response = await ScoreRouterBoardCryptoJS(
        encryptedData,
        (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.round((loaded * 100) / (total || 1));
          setUploadProgress(progress);
        },
      );

      // ตรวจสอบผลลัพธ์จาก API
      if (response.success) {
        setTimeout(() => {
          setCheckedRows(new Set());
          setIsLoading(false);
          handleClearScores();
          setShowSuccessModal(true);
        }, 2000);
      } else {
        throw new Error(response.message || "เกิดข้อผิดพลาดในการส่งข้อมูล");
      }
    } catch (error: any) {
      setIsLoading(false);
      setIsError(true);
      setErrorMessage(error.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }

    return () => {
      if (showSuccessModal) setShowSuccessModal(false);
      if (showWarnModal) setShowWarnModal(null);
    };
  };

  // ลบคะแนนที่เลือกทั้งหมด
  const handleClearScores = () => {
    const updatedScores = { ...scoresData };
    checkedRows.forEach((row: any) => {
      delete updatedScores[row.accountId];
    });
    setScoresData(updatedScores);
    setCheckedRows(new Set());
  };

  return (
    <>
      <Navbar />
      {/* loading */}
      {isLoading && (
        <LoadingModal
          isOpen={isLoading}
          progress={uploadProgress}
          isError={isError}
          errorMessage={errorMessage}
        />
      )}

      {showSuccessModal && (
        <ModalSuccess
          onClose={() => setShowSuccessModal(false)}
          details="ส่งข้อมูลสำเร็จเรียบร้อยแล้ว"
        />
      )}
      {showWarnModal && (
        <ModalWarn
          onClose={() => setShowWarnModal(null)}
          details={showWarnModal}
        />
      )}
      <div className="bg-slate-50 min-h-screen">
        {/* Page header */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 rounded-b-3xl shadow-xl">
          <div className="w-full mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="material-symbols-outlined text-blue-900 text-xl"
                  aria-hidden="true"
                >
                  folder_open
                </span>
                <h1 className="text-base sm:text-lg font-bold text-blue-900 truncate">
                  สำนักงานคณะ
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-7">
                ระดับ 5 = ดีมาก · ระดับ 4 = ดี · ระดับ 3 = ปานกลาง · ระดับ 2 =
                พอใช้ · ระดับ 1 = ต้องปรับปรุง
              </p>
            </div>
          </div>
        </div>

        <div className="w-full mx-auto px-4 sm:px-6 py-5">
          {/* Group selector */}
          <div className="mb-5">
            {/* Info Box */}
            <div className="mb-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <div className="flex items-start">
                <span className="material-symbols-outlined text-gray-500 mt-0.5 mr-2">
                  info
                </span>
                <div>
                  <p className="mt-1 text-sm text-red-700">
                    กรุณาเลือกกลุ่มที่ต้องการประเมิน เช่น "นักการเงินและบัญชี"
                    จากเมนูด้านล่าง เพื่อดูรายชื่อผู้ที่อยู่ในกลุ่มนั้น
                    และเริ่มประเมินได้เลยครับ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search + Actions bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-shrink-0 w-full sm:w-auto">
              <DropdownSelect
                options={Tabs}
                value={activeTab}
                onChange={(k) => setActiveTab(k as any)}
              />
            </div>

            <div className="relative flex-1">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg"
                aria-hidden="true"
              >
                search
              </span>
              <input
                type="search"
                placeholder="ค้นหาด้วยชื่อ, เลขประจำตัว..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex gap-2 flex-shrink-0 mb-5 justify-end">
            <label className="flex items-center gap-2  bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
              <input
                type="checkbox"
                className="w-4 h-4 text-teal-500 rounded border-slate-300 focus:ring-teal-400"
                onChange={(e) => {
                  if (e.target.checked) {
                    const allChecked = new Set(
                      filteredUsers.map((u) => ({
                        accountId: u.accountId,
                        fullname_th: u.fullname_th,
                      })),
                    );
                    setCheckedRows(allChecked);
                    setScoresData((prev) => {
                      const next = { ...prev };
                      filteredUsers.forEach((u) => {
                        if (!next[u.accountId])
                          next[u.accountId] = {
                            1: "",
                            2: "",
                            3: "",
                            4: "",
                            5: "",
                            6: "",
                            7: "",
                            8: "",
                            9: "",
                            comment: "",
                          };
                      });
                      return next;
                    });
                  } else {
                    setCheckedRows(new Set());
                    setScoresData({});
                  }
                }}
                checked={
                  filteredUsers.length > 0 &&
                  filteredUsers.every((u) =>
                    Array.from(checkedRows).some(
                      (r: any) => r.accountId === u.accountId,
                    ),
                  )
                }
              />
              <span className="text-slate-600 font-medium">เลือกทั้งหมด</span>
            </label>
            <button
              onClick={handleClearScores}
              disabled={checkedRows.size === 0}
              className={`flex  items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm ${
                checkedRows.size > 0
                  ? "bg-white border border-red-200 text-red-600 hover:bg-red-50"
                  : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span
                className="material-symbols-outlined text-base"
                aria-hidden="true"
              >
                delete_forever
              </span>
              <span className="hidden sm:inline">ยกเลิกทั้งหมด</span>
            </button>
          </div>

          {/* User cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleUsers.map((user: any) => {
              const isChecked = Array.from(checkedRows).some(
                (r: any) => r.accountId === user.accountId,
              );
              return (
                <UserCard
                  key={user.accountId}
                  user={user}
                  isChecked={isChecked}
                  currentComment={scoresData[user.accountId]?.comment || ""}
                  scores={scoresData[user.accountId]}
                  points={points}
                  onToggle={toggleRow}
                  onUpdateScore={updateScore}
                  onUpdateComment={updateComment}
                  onApplyTarget={applyTargetScores}
                />
              );
            })}
            {filteredUsers.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center gap-3 text-slate-400">
                <span
                  className="material-symbols-outlined text-4xl"
                  aria-hidden="true"
                >
                  search_off
                </span>
                <p className="text-sm">ไม่พบรายชื่อในกลุ่มนี้</p>
              </div>
            )}
          </div>

          {/* Floating search panel (hidden until opened) */}
          {isSearchOpen && (
            <div className="fixed top-20 right-6 z-60 w-80 md:w-96">
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">ค้นหา</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="p-1 rounded-md text-slate-500 hover:bg-slate-50"
                      aria-label="ปิดการค้นหา"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    ref={searchInputRef}
                    type="search"
                    placeholder="ค้นหาด้วยชื่อ, เลขประจำตัว..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                  />
                </div>

                <div className="mt-3">
                  <DropdownSelect
                    options={Tabs}
                    value={activeTab}
                    onChange={(k) => setActiveTab(k as any)}
                    widthClass="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {!isSearchOpen && (
            <div className="fixed top-22 right-6 z-50 group">
              <div className="fixed top-22 right-6 z-50 ">
                <div
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-white border border-slate-200 rounded-xl shadow-lg py-1 px-4 
                    cursor-pointer transition-all duration-300 hover:scale-105 
                    hover:shadow-xl hover:border-blue-300 group"
                >
                  <div
                    className="flex items-center justify-center text-slate-500 
                         group-hover:text-blue-500 gap-1 transition-colors duration-300"
                  >
                    <span className="material-symbols-outlined">search</span>
                    <h3 className="text-sm font-semibold">ค้นหา</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Competencies Panel - Open by default, can be closed */}
          {isCompetenciesOpen && (
            <div className="fixed top-32 right-6 z-40 w-80 md:w-96 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-700">
                    สมรรถนะที่ประเมิน
                  </h3>
                  <button
                    onClick={() => setIsCompetenciesOpen(false)}
                    className="p-1 rounded-md text-slate-500 hover:bg-slate-50 transition-colors"
                    aria-label="ปิดสมรรถนะที่ประเมิน"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Competencies List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {Menus_board.map((menu, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-600 border border-slate-100 rounded-md px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <span className="w-5 h-5 flex-shrink-0 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[12px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="leading-snug text-sm">
                        {menu.label.split(". ")[1] || menu.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isCompetenciesOpen && (
            <div className="fixed top-32 right-6 z-50">
              <div
                onClick={() => setIsCompetenciesOpen(true)}
                className="bg-teal-500 border border-teal-200 rounded-xl shadow-lg py-1 px-4 
                                              cursor-pointer transition-all duration-300 hover:scale-105 
                                              hover:shadow-xl hover:border-teal-300 group"
              >
                <div
                  className="flex items-center justify-center text-white 
                                                   group-hover:text-teal-100 gap-1 transition-colors duration-300"
                >
                  <span className="material-symbols-outlined">
                    eye_tracking
                  </span>
                  <h3 className="text-sm font-semibold">สมรรถนะที่ประเมิน</h3>
                </div>
              </div>
            </div>
          )}

          {/* Pagination controls */}
          {filteredUsers.length > 0 && (
            <div className="mt-6 flex justify-center px-2 sm:px-4">
              <div
                className="
           flex w-full max-w-md flex-col items-center gap-3
           rounded-2xl border border-slate-200
           bg-white/80 p-3 shadow-sm backdrop-blur
           sm:w-auto sm:flex-row sm:gap-4 sm:px-5 sm:py-4
         "
              >
                {/* Prev Button */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`
             group flex w-full items-center justify-center gap-2
             rounded-xl px-4 py-2.5 text-sm font-medium
             transition-all duration-200 sm:w-auto
             ${
               currentPage === 1
                 ? "cursor-not-allowed bg-slate-100 text-slate-400"
                 : "bg-slate-50 text-slate-700 hover:bg-slate-900 hover:text-white hover:shadow-md active:scale-95"
             }
           `}
                >
                  <span className="transition-transform group-hover:-translate-x-0.5">
                    ←
                  </span>
                  ก่อนหน้า
                </button>

                {/* Page Status */}
                <div
                  className="
             flex items-center justify-center gap-3
             rounded-xl bg-slate-50 px-4 py-2
             text-center
           "
                >
                  <div
                    className="
               flex h-10 w-10 items-center justify-center
               rounded-full bg-gradient-to-br
               from-blue-500 to-indigo-600
               text-sm font-bold text-white shadow
             "
                  >
                    {currentPage}
                  </div>

                  <div className="leading-tight">
                    <div className="text-xs text-slate-400 sm:text-sm">
                      หน้าปัจจุบัน
                    </div>
                    <div className="text-sm font-semibold text-slate-700 sm:text-base">
                      {currentPage} / {totalPages}
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`
             group flex w-full items-center justify-center gap-2
             rounded-xl px-4 py-2.5 text-sm font-medium
             transition-all duration-200 sm:w-auto
             ${
               currentPage === totalPages
                 ? "cursor-not-allowed bg-slate-100 text-slate-400"
                 : "bg-slate-50 text-slate-700 hover:bg-blue-600 hover:text-white hover:shadow-md active:scale-95"
             }
           `}
                >
                  ถัดไป
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Submit button (fixed bottom-right) */}
          <div className="mt-6">
            <button
              onClick={handleSendScores}
              disabled={checkedRows.size === 0}
              className={`fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm shadow-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 ${
                checkedRows.size > 0
                  ? "bg-teal-600 text-white hover:bg-teal-700 active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              ส่งคะแนนที่เลือก ({checkedRows.size} คน)
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
