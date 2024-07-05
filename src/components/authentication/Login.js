/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { saveUserToLocalStorage } from "@/utils/Localstorage";
import Link from "next/link";

const Login = ({ closeModal, setMessage, setPhone }) => {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        saveUserToLocalStorage(data);
        closeModal();
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="px-4 mt-[8rem] flex flex-col justify-between items-center">
      <div className="flex gap-5 items-center">
        <h2 className="font-futura font-semibold text-[30px]">Login</h2>
        <button onClick={closeModal}>
          <svg viewBox="0 0 24 24" width="30" height="30">
            <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path>
          </svg>
        </button>
      </div>
      <div className="w-full px-[1rem] md:px-[4rem] py-[2rem]">
        <div className="w-full relative">
          <input
            type="password"
            value={password}
            className={`focus:outline-none w-[100%] border border-solid px-[18px] py-[18px]`}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="password"
            className={`absolute left-4 text-[14px] text-[#9b9191] top-4 transition-all duration-300 ${
              password ? "translate-y-[-125%] text-[12px] bg-white" : ""
            }`}
          >
            Enter Password
          </label>
        </div>
        <div className="mt-4 text-center">Don't have an account? <Link className="text-red-500 underline " href="/authentication/UserRegister">Register</Link></div>
        <div className="mt-4 text-center">
          <a
            href="#"
            className="text-blue-500"
            onClick={() => router.push("/authentication/ForgotPassword")}
          >
            Forgot Password?
          </a>
        </div>
      </div>
      <button
        className="mt-[14px] text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[4rem] tracking-[1.5px] py-[18px] flex justify-center w-[50%] mx-auto"
        type="button"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
