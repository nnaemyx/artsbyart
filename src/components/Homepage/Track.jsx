import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPhoneFromLocalStorage, saveUserToLocalStorage } from "@/utils/Localstorage";
import Register from "../authentication/Register";
import Login from "../authentication/Login";

const Track = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("register");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
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
        toast.error("The phone number does not match our records. Please login.");
        openModal("login");
      }
    } else {
      toast.error("No account found with this phone number. Please register.");
      openModal("register");
    }
  };

  return (
    <div className="">
      <div className="relative">
        <div className="font-opensan 2xl:px-[30rem] xl:px-[20rem] md:px-[4rem] px-[1.5rem] h-full text-center mx-auto w-full">
          <div className="md:mt-36 mt-8 lg:h-[220px]">
            <h1 className="uppercase md:text-[30px] font-futura font-semibold">
              Track your orders
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
              maxWidth: "80%",
              maxHeight: "90%",
              width: "100%",
              height: "100%",
            },
          }}
        >
          {authMode === "register" ? (
            <Register
              closeModal={closeModal}
              setMessage={setMessage}
              phone={phone}
            />
          ) : (
            <Login
              closeModal={closeModal}
              setMessage={setMessage}
              phone={phone}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Track;
