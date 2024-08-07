import React, { useState } from "react";
import { toast } from "react-toastify";
import { saveUserToLocalStorage } from "@/utils/Localstorage";
import Spinner from "../Layouts/Spinner";


const Register = ({ closeModal }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const sendOtp = async () => {
    setLoading(true); // Show spinner
    try {
      const response = await fetch("/api/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: `+234${phone}`, otp }),
      });

      const data = await response.json();
      if (data.success) {
        setIsOtpSent(true);
        toast.success("An OTP message was sent to your number.");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error sending OTP");
    }finally {
      setLoading(false); // Hide spinner
    }
  };

  const validateOtp = async () => {
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: `+234${phone}`, otp }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("OTP validated successfully");
        handleRegister();
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error validating OTP");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();
    

      if (response.ok) {
        saveUserToLocalStorage(data);
        closeModal();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error during registration");
    }
  };

  return (
    <div className="px-4 mt-[1rem] flex flex-col justify-between items-center">
      <div className="flex gap-4 items-center">
        <h2 className="font-futura font-semibold text-[30px]">Register</h2>
        <button onClick={closeModal}>
          <svg viewBox="0 0 24 24" width="30" height="30">
            <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path>
          </svg>
        </button>
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
            className={`focus:outline-none w-[100%] border border-solid px-[18px] py-[18px]`}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="password"
            className={`absolute left-4 text-[14px] text-[#9b9191] top-4 transition-all duration-300 ${
              password ? "translate-y-[-125%] text-[12px] bg-white" : ""
            }`}
          >
            Create Password
          </label>
        </div>
      </div>
      <button
        className="mt-[14px] text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[4rem] tracking-[1.5px] py-[18px] flex justify-center w-[50%] mx-auto"
        type="button"
        onClick={sendOtp}
        disabled={loading} // Disable button while loading
      >
       {loading ? <Spinner /> : "Register"} {/* Show spinner or text */}
      </button>
      {isOtpSent && (
        <div className="mt-4 w-full px-[1rem] md:px-[4rem] py-[2rem]">
          <div className="w-full relative">
            <input
              type="number"
              value={otp}
              className={`focus:outline-none w-[100%] border border-solid px-[18px] py-[18px]`}
              onChange={(e) => setOtp(e.target.value)}
            />
            <label
              htmlFor="otp"
              className={`absolute left-4 text-[14px] text-[#9b9191] top-4 transition-all duration-300 ${
                otp ? "translate-y-[-125%] text-[12px] bg-white" : ""
              }`}
            >
              Enter OTP
            </label>
          </div>
          <button
            className="mt-[14px] text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[4rem] tracking-[1.5px] py-[18px] flex justify-center w-[50%] mx-auto"
            type="button"
            onClick={validateOtp}
          >
            Validate OTP
          </button>
        </div>
      )}
    </div>
  );
};

export default Register;
