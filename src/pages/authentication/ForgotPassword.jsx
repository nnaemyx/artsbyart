"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleForgotPassword = async () => {
    let formattedPhone = phone;

    if (phone.startsWith("0")) {
      formattedPhone = phone.slice(1);
    }

    if (phone.startsWith("+234")) {
      formattedPhone = phone.slice(4);
    }

    if (!formattedPhone) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }

    setPhoneError("");

    try {
      const response = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Reset link sent successfully via SMS");
      } else {
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error sending reset link");
    }
  };

  return (
    <div className=" items-center mx-auto font-opensans text-center justify-center mt-[6rem] lg:mt-[12rem]">
      <h1 className="text-[36px]">Forgot Password</h1>
      <div className=" mx-auto md:max-w-[478px] w-auto mt-[44px]">
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number (remove first 0 or +234)"
          className="focus:outline-none w-[100%] border border-solid px-[18px] py-[18px]"
        />
      </div>
      {phoneError && <p className="error">{phoneError}</p>}
      <button
        className="mt-[24px]  text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[0px] tracking-[1.5px] py-[18px] text-center w-[200px] "
        onClick={handleForgotPassword}
      >
        Send Reset Link
      </button>
    </div>
  );
};

export default ForgotPassword;
