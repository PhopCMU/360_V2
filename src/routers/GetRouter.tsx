import axios from "axios";
import { configs } from "../config/conf";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}
const secretKey = import.meta.env.VITE_SECRET_KEY_CRYPTO_FRONTEND;
// const headers = {
//   Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
//   "Content-Type": "application/json",
// };

export const fetchDataAgency = async (
  agencyString: string
): Promise<ApiResponse> => {
  try {
    // 1. เข้ารหัสเลขบัตรประชาชน
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(agencyString),
      secretKey
    ).toString();

    // 2. encode เพื่อใส่ใน URL
    const encodedEncryptedData = encodeURIComponent(encryptedData);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      "Content-Type": "application/json",
    };
    // 3. ส่ง GET request พร้อม encryptedData ใน query string
    const response = await axios.get<ApiResponse>(
      `${configs.URL_API}/360/agency/level2`,
      {
        headers,
        params: {
          encryptedData: encodedEncryptedData,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error during search:", error);
    const navigate = useNavigate();
    if (error.response.data.message === "Authentication failed") {
      // window.location.href = "/";
      navigate("/");
    }

    if (error.response && error.response.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};

// ดึงข้อมูลเฉพาะ ชันสูตร
export const fetchDataBoardAgency = async (
  agencyString: string
): Promise<ApiResponse> => {
  try {
    // 1. เข้ารหัสเลขบัตรประชาชน
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(agencyString),
      secretKey
    ).toString();

    // 2. encode เพื่อใส่ใน URL
    const encodedEncryptedData = encodeURIComponent(encryptedData);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      "Content-Type": "application/json",
    };
    // 3. ส่ง GET request พร้อม encryptedData ใน query string
    const response = await axios.get<ApiResponse>(
      `${configs.URL_API}/360/agency/level3`,
      {
        headers,
        params: {
          encryptedData: encodedEncryptedData,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error during search:", error);
    const navigate = useNavigate();
    if (error.response.data.message === "Authentication failed") {
      // window.location.href = "/";
      navigate("/");
    }

    if (error.response && error.response.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};

// ดึงข้อมูล sanbox ทั้งหมด ยกเว้น ชันสูตร
export const fetchDataSanbox = async (
  agencyString: string
): Promise<ApiResponse> => {
  try {
    // 1. เข้ารหัสเลขบัตรประชาชน
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(agencyString),
      secretKey
    ).toString();

    // 2. encode เพื่อใส่ใน URL
    const encodedEncryptedData = encodeURIComponent(encryptedData);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      "Content-Type": "application/json",
    };
    // 3. ส่ง GET request พร้อม encryptedData ใน query string
    const response = await axios.get<ApiResponse>(
      `${configs.URL_API}/360/agency/level2/sanbox`,
      {
        headers,
        params: {
          encryptedData: encodedEncryptedData,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error during search:", error);
    const navigate = useNavigate();
    if (error.response.data.message === "Authentication failed") {
      // window.location.href = "/";
      navigate("/");
    }

    if (error.response && error.response.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};
