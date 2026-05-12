import axios from "axios";
import { configs } from "../config/conf";
// import CryptoJS from "crypto-js";

// ประเภทของข้อมูลตอบกลับ
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const ScoreRouterCryptoJS = async (
  formDataToSend: string,
  onUploadProgress: (progressEvent: any) => void
): Promise<ApiResponse> => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      "Content-Type": "multipart/form-data",
    };
    const payload = {
      encryptedData: formDataToSend,
    };
    const response = await axios.post<ApiResponse>(
      `${configs.URL_API}/360/score/send`,
      payload,
      {
        headers,
        onUploadProgress: onUploadProgress,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error during score submission:", error);
    if (error.response && error.response.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};

export const ScoreRouterBoardCryptoJS = async (
  formDataToSend: string,
  onUploadProgress: (progressEvent: any) => void
): Promise<ApiResponse> => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      "Content-Type": "multipart/form-data",
    };
    const payload = {
      encryptedData: formDataToSend,
    };
    const response = await axios.post<ApiResponse>(
      `${configs.URL_API}/360/score/send/board`,
      payload,
      {
        headers,
        onUploadProgress: onUploadProgress,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error during score submission:", error);
    if (error.response && error.response.data) {
      return error.response.data as ApiResponse;
    }

    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    };
  }
};
