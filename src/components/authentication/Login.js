/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { saveUserToLocalStorage } from "@/utils/Localstorage";
import Link from "next/link";
import Spinner from "../Layouts/Spinner";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true); // Show spinner
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        saveUserToLocalStorage(data);
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <div className="px-4 mt-[1rem] flex flex-col justify-between items-center">
      <div className="flex gap-5 items-center">
        <h2 className="font-futura font-semibold text-[30px]">Login</h2>
      </div>
      <div className="w-full px-[1rem] md:px-[4rem] py-[2rem]">
        <div className="w-full relative mt-4">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="number"
            className="focus:outline-none w-[100%] border border-solid px-[18px] py-[18px]"
          />
          <label
            htmlFor="phone"
            className={`absolute left-4 text-[14px] text-[#9b9191] top-4 transition-all duration-300 ${
              phone ? "translate-y-[-125%] text-[12px] bg-white" : ""
            }`}
          >
           Remove the first 0 of your phone number
          </label>
        </div>
        <div className="w-full relative mt-4">
          <input
            type="password"
            value={password}
            className="focus:outline-none w-[100%] border border-solid px-[18px] py-[18px]"
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
        <div className="mt-4 text-center">
          Don't have an account?{" "}
          <Link
            className="text-red-500 underline "
            href="/authentication/UserRegister"
          >
            Register
          </Link>
        </div>
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
        className="mt-[14px] text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[4rem] tracking-[1.5px] py-[18px] flex justify-center w-[50%] mx-auto relative"
        type="button"
        onClick={handleLogin}
        disabled={loading} // Disable button while loading
      >
        {loading ? <Spinner /> : "Login"} {/* Show spinner or text */}
      </button>
    </div>
  );
};

export default Login;
