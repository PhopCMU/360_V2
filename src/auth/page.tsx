import { Suspense } from "react";
import { AuthContent } from "../lib/authContent";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense
        fallback={
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        }
      >
        <AuthContent />
      </Suspense>
    </div>
  );
}
