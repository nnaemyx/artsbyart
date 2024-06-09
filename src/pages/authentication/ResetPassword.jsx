import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import jwt from "jsonwebtoken";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { token } = router.query;

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      // Log token before making the request
      console.log("Token used:", token);

      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Password reset successfully");
        router.push("/login");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error resetting password");
    }
  };

  return (
    <div className=" font-opensans text-center ">
      <h1 className="text-[36px]">Reset Password</h1>
      <div className="font-opensans mx-auto md:max-w-[478px] w-auto mt-[44px]">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="focus:outline-none w-[100%] border border-solid px-[18px] py-[18px]"
          />
        </div>
        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="focus:outline-none w-[100%] border border-solid px-[18px] py-[18px]"
          />
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <button
        className="mt-[24px]  text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[0px] tracking-[1.5px] py-[18px] w-[200px]"
        onClick={handleResetPassword}
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
