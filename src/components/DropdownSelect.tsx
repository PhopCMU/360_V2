import { useEffect, useRef, useState } from "react";

type TabOption = { key: string; label?: string; icon?: string; color?: string };

interface DropdownSelectProps {
  options: TabOption[];
  value: string;
  onChange: (key: string) => void;
  placeholder?: string;
  widthClass?: string;
  className?: string;
}

const colorClassMap: Record<string, string> = {
  teal: "text-teal-600",
  blue: "text-blue-600",
  green: "text-green-600",
  red: "text-red-600",
  indigo: "text-indigo-600",
  purple: "text-purple-600",
  pink: "text-pink-600",
  yellow: "text-yellow-600",
  gray: "text-gray-600",
  slate: "text-slate-600",
  orange: "text-orange-600",
  cyan: "text-cyan-600",
  sky: "text-sky-600",
  lime: "text-lime-600",
};

export function getColorClass(color?: string, fallback = "text-gray-600") {
  return colorClassMap[color || ""] ?? fallback;
}

export default function DropdownSelect({
  options,
  value,
  onChange,
  placeholder = "เลือกกลุ่ม...",
  widthClass = "w-full md:w-72",
  className = "",
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = options.filter((opt) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (opt.label || opt.key || "").toLowerCase().includes(q) ||
      String(opt.key).toLowerCase().includes(q)
    );
  });

  const selected = options.find((o) => o.key === value);

  return (
    <div
      ref={ref}
      className={`relative inline-block ${widthClass} ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              <span
                className={`material-symbols-outlined mr-2 ${
                  colorClassMap[selected.color || ""] ?? "text-gray-500"
                }`}
              >
                {selected.icon}
              </span>
              <span className="truncate">{selected.label || selected.key}</span>
            </>
          ) : (
            <span className="text-gray-500 truncate">{placeholder}</span>
          )}
        </div>
        <span className="material-symbols-outlined">expand_more</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา..."
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="max-h-56 overflow-auto">
            {filtered.map((opt) => {
              const isActive = opt.key === value;
              const iconColor =
                colorClassMap[opt.color || ""] ??
                (isActive ? "text-teal-600" : "text-gray-400");
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    onChange(opt.key);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 ${
                    isActive ? "bg-slate-100 font-medium" : ""
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${isActive ? iconColor : "text-gray-400"}`}
                  >
                    {opt.icon}
                  </span>
                  <span className="truncate">{opt.label || opt.key}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                ไม่พบผลลัพธ์
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
