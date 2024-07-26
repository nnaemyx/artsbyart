import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCustomContext } from "@/context/Customcontext";
import Link from "next/link";
import { AccountIcon2, SearchIcon } from "@/icon";
import MobileSearch from "./MobileSearch";
import { useRouter } from "next/router";
import { getUserFromLocalStorage, removeUserFromLocalStorage } from "@/utils/Localstorage";
import Login from "../authentication/Login";
import Register from "../authentication/Register";
import { useModal } from "@/context/ModalContext";

const Mobileheader = () => {
  const [bg, setBg] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const loggedInUser = getUserFromLocalStorage();
  const { openModal, closeModal, isModalOpen, modalContent } = useModal();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = () => {
    openModal(<Login closeModal={closeModal} />);
  };
  const handleRegister = () => {
    openModal(<Register closeModal={closeModal} />);
  };
  const handleSignOut = () => {
    removeUserFromLocalStorage();
    router.push("/"); // Redirect to home page after sign-out
  };
  const {
    isLeftOpen,
    openLeft,
    closeLeft,
    isBottomOpen,
    openBottom,
    closeBottom,
  } = useCustomContext();

  useEffect(() => {
    // add event listener
    window.addEventListener("scroll", () => {
      // when scrollY is bigger than 50px setBg to true, else false
      return window.scrollY > 50 ? setBg(true) : setBg(false);
    });
  });
  return (
    <div>
      <nav
        className={`${
          // if bg is true
          bg
            ? "bg-black top-0 text-white  z-10"
            : // if bg is false
              "bg-white text-dark top-0 z-10"
        }
    fixed left-0  z-10  font-opensans  text-secondary w-full transition-all  duration-200`}
      >
        <div className="flex items-center px-4 justify-between">
          <div className="w-[120px]">
            <Image
              src="https://res.cloudinary.com/dgms1mpbw/image/upload/v1699825747/ARTS_BY_ART_LOGO_ydpcyd_nzavtb.png"
              width={370}
              height={0}
              alt="logo"
              className="-ml-5"
            />
            <p className="text-[5px] -mt-6 -ml-5 px-5 mb-6 italic tracking-[.051rem]">
              ...you imagine we create
            </p>
          </div>
      
          <div className="flex items-center gap-4">
            <div onClick={openBottom}>
              <SearchIcon className="fill-white" />
            </div>
            {loggedInUser ? (
              <div className="relative group">
                <button
                  type="button"
                  className=" focus:outline-none"
                  onClick={toggleDropdown}
                >
                  <AccountIcon2 className="" />
                </button>
                {isOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative group">
              <button
                type="button"
                className="focus:outline-none"
                onClick={toggleDropdown}
              >
                <AccountIcon2 className="" />
              </button>
              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <div
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={handleLogin}
                    >
                      <p className="block px-4 py-2 text-sm text-gray-700">
                        Login
                      </p>
                    </div>
                    <div
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={handleRegister}
                    >
                      <p className="block px-4 py-2 text-sm text-gray-700">
                        Register
                      </p>
                    </div>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                  </div>
                </div>
              )}
            </div>
            )}
            <button
              onClick={openLeft}
              className="text-[20px] rounded-full px-3 py-1.5  border border-solid "
            >
              &#9776;
            </button>
          </div>
        </div>
      </nav>
      {isLeftOpen && (
        <div
          className={`${
            isLeftOpen ? "left-0 transition-all" : "-left-full"
          } lg:hidden z-10 fixed bottom-0 w-[80%] max-w-xs h-screen transition-all`}
        >
          <div className=" z-10  items-start bg-white h-full w-[120%] ">
            <div className="w-full  ">
              <button onClick={closeLeft} className="px-6 mt-[4rem]  text-dark">
                <svg viewBox="0 0 24 24" width="30" height="30">
                  <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path>
                </svg>
              </button>
            </div>
            <div className="font-opensans px-6 flex flex-col gap-[25px] mt-4 ">
              <Link href="/" onClick={closeLeft}>
                <p className="text-[15px]">Home</p>
              </Link>

              <Link href="/shop" onClick={closeLeft} className="relative group">
                <p className="text-[15px]">Shop</p>
              </Link>

              <Link
                href="/contact"
                onClick={closeLeft}
                className="relative group"
              >
                <p className="text-[15px]">Contact Us</p>
              </Link>
              {/* <Link
                href="/contact"
                onClick={closeLeft}
                className="relative group"
              >
                <p className="text-[15px]">Become a Supplier</p>
              </Link> */}
              <Link
                href="/ICregister/Registration"
                onClick={closeLeft}
                className="relative group"
              >
                <p className="text-[15px]">Become an IC</p>
              </Link>
              {/* <Link
                href="/contact"
                onClick={closeLeft}
                className="relative group"
              >
                <p className="text-[15px]">Mission</p>
              </Link> */}
              <Link
                href="/about"
                onClick={closeLeft}
                className="relative group"
              >
                <p className="text-[15px]">About Us</p>
              </Link>
              {/* <Link
                href="/authentication/login"
                onClick={closeLeft}
                className="relative group"
              >
                <p className="text-[15px]">Admin</p>
              </Link> */}
            </div>
          </div>
        </div>
      )}
          {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white h-[80%] w-[80%] p-6 rounded-lg shadow-lg">
            {modalContent}
          </div>
        </div>
      )}
      {isBottomOpen && <MobileSearch />}
    </div>
  );
};

export default Mobileheader;
