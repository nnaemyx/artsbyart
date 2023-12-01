import React, { useState } from "react";
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
  const [userExists, setUserExists] = useState(
    getPhoneFromLocalStorage() !== null
  );
  const [focusedInput, setFocusedInput] = useState(null);
  const router = useRouter();

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
  const handleAction = async () => {
    try {
      // Extract the phone number from localStorage
      const storedPhone = getPhoneFromLocalStorage();

      // If the user exists, perform login action
      if (storedPhone) {
        // Compare the stored phone number with the input phone number
        if (storedPhone === phone) {
          const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: phone, password }),
          });

          const data = await response.json();

          setMessage(data.message);

          // Close the modal on successful login
          if (response.ok) {
            closeModal();
            // router.reload(); // Reload the page or perform any other action as needed
          }
        } else {
          setMessage("Phone number does not match. Please try again.");
        }
      } else {
        // If the user doesn't exist, perform registration action
        const response = await fetch("/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone: phone, password }),
        });

        const data = await response.json();

        // Save user to localStorage
        saveUserToLocalStorage(data);

        // Update userExists state based on the response
        setUserExists(response.ok);
        if (response.ok) {
          toast.success("Account created successfully")
          closeModal();
          // router.reload(); // Reload the page or perform any other action as needed
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="">
      <div className="relative">
      
        <div className=" font-opensan 2xl:px-[30rem] xl:px-[20rem] md:px-[4rem] px-[1.5rem] h-full  text-center mx-auto  w-full">
          <div className=" md:mt-36 mt-8 lg:h-[220px]  ">
            <h1 className="uppercase md:text-[30px] font-futura font-semibold">
              Track your orders
            </h1>
            <form className="md:mt-8 mt-4">
              <div className=" relative gap-6">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="number"
                  placeholder="Phone Number"
                  className="focus:outline-none w-full border border-solid border-dark md:px-4 px-2 md:w-[32rem] rounded-md py-[0.27rem] md:py-[1.06rem] "
                />

                <button
                  type="button"
                  className="bg-primary md:px-12 text-[12px] md:text-[18px] md:rounded-md md:py-4 py-2 px-6 text-white absolute right-[0rem] 425:right-[3.4rem]"
                  onClick={() => {
                    openModal(userExists ? "login" : "register");
                  }}
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
          {/* Display different forms based on authMode and userExists */}
          {authMode === "register" && (
            <div className="w-full px-[1rem] md:px-[4rem] py-[2rem]">
              {/* New user registration form */}
              <div className="w-full relative">
                <input
                  type="password"
                  value={password}
                  className={`focus:outline-none w-[100%] border border-solid px-[18px] py-[18px] ${
                    focusedInput === "password"
                      ? "border-dark border-[1.5px]"
                      : "border-gray-300 "
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
                  Create Password
                </label>
              </div>
              {/* <label>
              Confirm Password:
              <input
                type="password"
                // Add validation or confirmation logic as needed
              />
            </label> */}
            </div>
          )}
          {authMode === "login" && (
         <div className="w-full px-[1rem] md:px-[4rem] py-[2rem]">
         {/* New user registration form */}
         <div className="w-full relative">
           <input
             type="password"
             value={password}
             className={`focus:outline-none w-[100%] border border-solid px-[18px] py-[18px] ${
               focusedInput === "password"
                 ? "border-dark border-[1.5px]"
                 : "border-gray-300 "
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
             Enter Password
           </label>
         </div>
         {/* <label>
         Confirm Password:
         <input
           type="password"
           // Add validation or confirmation logic as needed
         />
       </label> */}
       </div>
          )}
          <button
            className="mt-[14px]  text-[12px] md:text-[14px] font-semibold bg-primary text-white px-[4rem] tracking-[1.5px] py-[18px] flex justify-center w-[50%] mx-auto"
            type="submit"
            onClick={handleAction}
          >
            {authMode === "register" ? "Register" : "Login"}
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default Track;
