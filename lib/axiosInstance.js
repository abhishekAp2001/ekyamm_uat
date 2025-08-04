// lib/axiosInstance.js
import axios from "axios";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import { Baseurl } from "./constants";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { getStorage } from "./utils";

function getUserToken() {
   if (typeof window === "undefined") return null;
  const tryParse = (storage) => {
    const itemStr = storage.getItem("user");
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      if (item.expiry) {
        const now = new Date().getTime();
        if (now > item.expiry) {
          storage.removeItem("user");
          return null;
        }
      }
      return item.value;
    } catch {
      storage.removeItem("user");
      return null;
    }
  };

  return tryParse(sessionStorage) || tryParse(localStorage);
}

const axiosInstance = () => {
  // const token = hasCookie("user") ? JSON.parse(getCookie("user")) : "";
  const token = getUserToken();
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
      Accept: "application/json",
      accesstoken: token?.token || "",
    },
  });

  // Set multipart/form-data properly for FormData requests
  instance.interceptors.request.use(
    (config) => {
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }
      return config;
    },
    (error) => Promise.reject(error) // forward error to .catch
  );

  // Let all responses and errors pass through
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const code = error.response?.data?.error?.code;
      const message = error.response?.data?.error?.message;
      // if (code === 440 && message === "invalid signature") {
      //   showErrorToast("Invalid Token. Please Login Again");
      //   deleteCookie("user");
      //   return Promise.reject({ ...error, forceLogout: true });
      // } else if (code === 400 && message === "Token must be provided!") {
      //   showErrorToast("Token must be provided!");
      //   deleteCookie("user");
      //   return Promise.reject({ ...error, forceLogout: true });
      // } 
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosInstance;
