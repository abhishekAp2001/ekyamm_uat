"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { customEncodeString, encryptData } from "@/lib/utils";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { whatsappUrl } from "@/lib/constants";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const axios = axiosInstance();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Validation function
  const validateInputs = (userName, password) => {
    if (!userName.trim()) {
      return "Please enter a valid email or mobile number";
    }
    if (!password.trim()) {
      return "Please enter a password";
    }
    return "";
  };

  const handleLogin = async () => {
    // Reset error state
    setError("");

    // Validate inputs
    const validationError = validateInputs(userName, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const encodedPassword = customEncodeString(password);
      const encryptedPassword = encryptData(encodedPassword);
      const payload = {
        email: userName,
        password: encryptedPassword,
      };
      const response = await axios.post("/v2/auth/user/signin", payload);
      if (response?.data?.success === true) {
        showSuccessToast("Login Successful");
        if (
          response?.data?.data?.userType === "superAdmin" &&
          response?.data?.data?.status === "active"
        ) {
          setCookie("user", response?.data?.data);
          router.push("/sales");
        }
      }
    } catch (error) {
      console.log("error", error);
      if (error.forceLogout) {
        router.push("/login");
      } else {
        setError(
          error?.response?.data?.error?.message || "Wrong Username/Password"
        );
        showErrorToast(error?.response?.data?.error?.message || "Login Failed");
      }
    }
  };

  return (
    <>
      <div className="bg-gradient-to-b from-[#DFDAFB] to-[#F9CCC5] h-screen relative max-w-[576px] mx-auto">
        <div className=" h-full flex  items-center px-4">
          <div className="w-full">
            <div className="border-2 bg-[#FFFFFF80] border-[#FFFFFF4D] rounded-4xl pt-5 px-6 pb-3 text-center w-full">
              <strong className="text-[16px] text-black font-[600] text-center">
                Login to proceed
              </strong>

              <div className="pt-6">
                {/* <Input
                  type="text"
                  placeholder="Enter mobile number or email address"
                  className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px]"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                /> */}

                <Input
                  type="text"
                  placeholder="Enter mobile number or email address"
                  className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px]"
                  value={userName}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setUserName(inputValue.toLowerCase()); // Convert to lowercase
                  }}
                />

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="bg-white rounded-[7.26px] placeholder:text-[12px] placeholder:text-gray-400 pt-3 pb-3.5 px-4 h-[39px] mt-6"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  {showPassword ? (
                    <Eye
                      className="w-[14.67px] absolute top-2 right-[14.83px]"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  ) : (
                    <EyeOff
                      className="w-[14.67px] absolute top-2 right-[14.83px]"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between mt-[11.72px]">
                  <div className="flex gap-[6px] items-center">
                    <Checkbox className="w-4 h-4 border border-[#776EA5] rounded-[1.8px]" id="forgot-password"/>
                    <label htmlFor="forgot-password" className="text-[12px] text-gray-500">
                      Remember Me
                    </label>
                  </div>
                  <Link
                    href={"/forgot_password"}
                    className="text-[12px] text-gray-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                disabled={!userName || !password}
                  className="mt-6 bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px] h-[45px] w-full rounded-[8px] flex items-center justify-center cursor-pointer disabled:opacity-60"
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  Login
                </Button>
                {/* Error message display */}
                {error && (
                  <p className="text-red-500 text-[12px] mt-2 text-center">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* footer */}
        <div className="flex flex-col justify-center items-center gap-[4.75px] fixed bottom-0 pb-[26px] left-0 right-0 max-w-[574px] mx-auto">
          <div className="flex gap-1 items-center">
            <span className="text-[10px] text-gray-500 font-medium">
              Copyright © {new Date().getFullYear()}
            </span>
            <Image
              src="/images/ekyamm.png"
              width={100}
              height={49}
              className="w-[106px] mix-blend-multiply"
              alt="ekyamm"
            />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-gray-500 font-medium">
              Any technical support
            </span>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/chat_icon.png"
                width={54}
                height={49}
                className="w-[54px]"
                alt="ekyamm"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
