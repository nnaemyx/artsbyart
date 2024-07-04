import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getPhoneFromLocalStorage,
  saveUserToLocalStorage,
} from "@/utils/Localstorage";

const Track = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("register");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpExpiryTime, setOtpExpiryTime] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedPhone = getPhoneFromLocalStorage();
    if (storedPhone) {
      setPhone(storedPhone);
    }
  }, []);

  const handleInputClick = (inputName) => {
    setFocusedInput(inputName);
  };

  const openModal = (mode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
    setMessage(""); // Clear the message when opening the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessage(""); // Clear the message when closing the modal
  };

  const openOtpModal = () => {
    setIsOtpModalOpen(true);
  };

  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
    setOtp(""); // Clear the OTP input when closing the modal
  };

  const checkUserExists = async (phone) => {
    const response = await fetch(`/api/users/check-phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });
    const data = await response.json();
    return data.exists;
  };

  const handleTrack = async () => {
    if (phone.charAt(0) === "0") {
      setPhoneError("Please remove the first 0 from the phone number.");
      return;
    }

    // Reset phone error if no issues
    setPhoneError("");
    const exists = await checkUserExists(phone);
    setUserExists(exists);

    if (exists) {
      const storedPhone = getPhoneFromLocalStorage();
      if (storedPhone === phone) {
        router.push("/orders");
      } else {
        openModal("login");
      }
    } else {
      openModal("register");
    }
  };

  const sendOtp = async () => {
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
        setOtpExpiryTime(Date.now() + 5 * 60 * 1000); // Set OTP expiry time to 5 minutes from now
        openOtpModal();
        toast.success("OTP sent successfully");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error sending OTP");
    }
  };

  const validateOtp = async () => {
    if (Date.now() > otpExpiryTime) {
      toast.error("OTP has expired. Please request a new one.");
      closeOtpModal();
      return;
    }

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: `+234${phone}`, otp }),
      });
      console.log(phone, otp);

      const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success("OTP validated successfully");
        closeOtpModal();
        handleRegister(); // Proceed with the registration process
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error validating OTP");
    }
  };

  const handleAction = async () => {
    try {
      if (authMode === "login") {
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
      } else {
        // Send OTP before registering the user
        await sendOtp(phone);
      }
    } catch (error) {
      console.error("Error:", error);
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
      setMessage(data.message);

      if (response.ok) {
        saveUserToLocalStorage(data);
        closeModal();
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error during registration");
    }
  };
  return (
    <div className="">
      <div className="relative">
        <div className="font-opensan 2xl:px-[30rem] xl:px-[20rem] md:px-[4rem] px-[1.5rem] h-full text-center mx-auto w-full">
          <div className="md:mt-36 mt-8 lg:h-[220px]">
            <h1 className="uppercase md:text-[30px] font-futura font-semibold">
              Login and Track your orders
            </h1>
            <form className="md:mt-8 mt-4">
              <div className="relative gap-6">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="number"
                  placeholder="Phone Number (remove first 0)"
                  className="focus:outline-none w-full border border-solid border-dark md:px-4 px-2 md:w-[32rem] rounded-md py-[0.27rem] md:py-[1.06rem]"
                />

                {phoneError && (
                  <p className="text-red-500 mt-2">{phoneError}</p>
                )}

                <button
                  type="button"
                  className="bg-primary md:px-12 text-[12px] md:text-[18px] md:rounded-md md:py-4 py-2 px-6 text-white absolute right-[0rem] 425:right-[0.1rem]"
                  onClick={handleTrack}
                >
                  Track
                </button>
              </div>
            </form>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          contentLabel="Authentication Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 9999,
            },
            content: {
              padding: 0,
              border: "none",
              borderRadius: "8px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "90%",
              maxHeight: "58%",
              width: "100%",
              height: "100%",
            },
          }}
        >
          <div className="px-4 mt-6 flex justify-between items-center">
            <h2 className="font-futura font-semibold text-[30px]">
              {authMode === "register" ? "Register" : "Login"}
            </h2>
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
                className={`focus:outline-none w-[100%] border border-solid px-[18px] py-[18px] ${
                  focusedInput === "password"
                    ? "border-dark border-[1.5px]"
                    : "border-gray-300"
                }`}
                onClick={() => handleInputClick("password")}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="name"
                className={`absolute left-4 text-[14px] text-[#9b9191] top-4 transition-all duration-300 ${
                  focusedInput === "password" || password
                    ? "translate-y-[-125%] text-[12px] bg-white"
                    : ""
                }`}
              >
                {authMode === "register" ? "Create Password" : "Enter Password"}
              </label>
            </div>
            {authMode === "login" && (
        <div className="mt-4 text-center">
          <a
            href="#"
            className="text-blue-500"
            onClick={() => router.push("/authentication/ForgotPassword")}
          >
            Forgot Password?
          </a>
        </div>
      )}
          </div>
          <button
            className="mt-[14px] text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[4rem] tracking-[1.5px] py-[18px] flex justify-center w-[50%] mx-auto"
            type="submit"
            onClick={handleAction}
          >
            {authMode === "register" ? "Register" : "Login"}
          </button>
        </Modal>
        <Modal
          isOpen={isOtpModalOpen}
          onRequestClose={closeOtpModal}
          ariaHideApp={false}
          contentLabel="OTP Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 9999,
            },
            content: {
              padding: 0,
              border: "none",
              borderRadius: "8px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "90%",
              maxHeight: "58%",
              width: "100%",
              height: "100%",
            },
          }}
        >
          <div className="px-4 mt-6 flex justify-between items-center">
            <h2 className="font-futura font-semibold text-[30px]">Enter OTP</h2>
            <button onClick={closeOtpModal}>
              <svg viewBox="0 0 24 24" width="30" height="30">
                <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path>
              </svg>
            </button>
          </div>
          <div className="w-full px-[1rem] md:px-[4rem] py-[2rem]">
            <div className="w-full relative">
              <input
                type="number"
                value={otp}
                className={`focus:outline-none w-[100%] border border-solid px-[18px] py-[18px] ${
                  focusedInput === "otp"
                    ? "border-dark border-[1.5px]"
                    : "border-gray-300"
                }`}
                onClick={() => handleInputClick("otp")}
                onChange={(e) => setOtp(e.target.value)}
              />
              <label
                htmlFor="otp"
                className={`absolute left-4 text-[14px] text-[#9b9191] top-4 transition-all duration-300 ${
                  focusedInput === "otp" || otp
                    ? "translate-y-[-125%] text-[12px] bg-white"
                    : ""
                }`}
              >
                Enter OTP
              </label>
            </div>
          </div>
          <button
            className="mt-[14px] text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[4rem] tracking-[1.5px] py-[18px] flex justify-center w-[50%] mx-auto"
            type="button"
            onClick={validateOtp}
          >
            Validate OTP
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default Track;
