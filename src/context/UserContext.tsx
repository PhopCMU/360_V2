import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { UserInfoGet } from "../model/authModel";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../routers/authServer";

const AUTH_SYNC_CHANNEL = "auth-sync";

type UserContextType = {
  userData: UserInfoGet | null;
  setUserData: React.Dispatch<React.SetStateAction<UserInfoGet | null>>;
  getUserData: () => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserInfoGet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const inflowRef = useRef(false);
  const bcRef = useRef<BroadcastChannel | null>(null);

  const logout = useCallback(() => {
    const loginMethod = localStorage.getItem("loginMethod");
    localStorage.removeItem("authToken");
    bcRef.current?.postMessage({ type: "AUTH_LOGOUT" });
    if (loginMethod === "cmu-account-board") {
      navigate("/board");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getUserData = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      setUserData(null);
      return;
    }

    if (inflowRef.current) return;
    inflowRef.current = true;

    try {
      const response: any = await verifyToken(token);
      // รองรับทั้งรูปแบบ { success: boolean, data: User } และ User โดยตรง
      const user = response?.success ? response.data : response;
      if (!user) {
        logout();
        return;
      }

      const organization_code = user.organization_code;
      const workstatus = user.status_user;

      if (organization_code !== "14" || workstatus !== "active") {
        logout();
        return;
      }

      setUserData(user as UserInfoGet);
      bcRef.current?.postMessage({ type: "AUTH_USER_DATA", user });
    } catch (error) {
      console.error("Failed to verify token:", error);
      logout();
    } finally {
      inflowRef.current = false;
      setLoading(false);
    }
  }, [logout]);

  // BroadcastChannel: sync auth state across tabs
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const bc = new BroadcastChannel(AUTH_SYNC_CHANNEL);
    bcRef.current = bc;

    bc.onmessage = (event) => {
      if (event.data?.type === "AUTH_USER_DATA" && event.data.user) {
        setUserData(event.data.user as UserInfoGet);
        setLoading(false);
      } else if (event.data?.type === "AUTH_LOGOUT") {
        setUserData(null);
      }
    };

    return () => {
      bc.close();
      bcRef.current = null;
    };
  }, []);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        getUserData,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
