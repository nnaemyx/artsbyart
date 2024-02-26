import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import Link from 'next/link'
import { account } from "@/utils/appwrite";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const router = useRouter();

  const handleInputClick = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleLogin = async () => {
    try {
      // Call Appwrite's login method
      const response = await account.createEmailSession(email, password);
  
      // Check if the login was successful
      if (response.$id) {
        // Login successful
        toast.success("IC logged in successfully");
        router.push("/integratedC");
      } else {
        console.error("Login failed:", response.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="mt-[10rem] text-center">
      <h2 className="text-[36px]">IC Login</h2>
      <div className="mx-auto text-center px-8 md:px-0">
        <form className="font-opensans mx-auto md:max-w-[478px] w-auto mt-[44px]">
          <div className="mt-4 relative">
            <input
              type="email"
              value={email}
              placeholder=" "
              className={`focus:outline-none w-[100%] border border-solid px-[18px] py-[18px] ${
                focusedInput === "email"
                  ? "border-dark border-[1.5px]"
                  : "border-gray-300 "
              }`}
              onClick={() => handleInputClick("email")}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="
              email"
              className={`absolute left-4 text-[14px] text-[#9b9191] top-4 transition-all duration-300 ${
                focusedInput === "email" || email
                  ? "translate-y-[-125%] text-[12px] bg-white"
                  : ""
              }`}
            >
              email
            </label>
          </div>
          <br />
          <div className="mt-4 relative">
            <input
              type="password"
              value={password}
              placeholder=" "
              className={`focus:outline-none w-[100%] border border-solid px-[18px] py-[18px] ${
                focusedInput === "password"
                  ? "border-dark border-[1.5px]"
                  : "border-gray-300 "
              }`}
              onClick={() => handleInputClick("password")}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="password"
              className={`absolute left-4 text-[14px] top-4 text-[#9b9191] transition-all duration-300 ${
                focusedInput === "password" || password
                  ? "translate-y-[-125%] text-[12px] bg-white"
                  : ""
              }`}
            >
              Password
            </label>
          </div>
          <br />
          <button
            className="mt-[24px]  text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[0px] tracking-[1.5px] py-[18px] w-full"
            type="button"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
      </div>
      <div className="mt-6 mb-20">
        <p>Create Account, <Link className="text-primary" href="/ICregister/Registration">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
