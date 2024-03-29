import { AccountIcon2, CartIcon, MessageIcon, SearchIcon } from "@/icon";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { getUserFromLocalStorage, removeUserFromLocalStorage } from "@/utils/Localstorage";


const Navbar = () => {
  const [bg, setBg] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const loggedInUser = getUserFromLocalStorage();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    removeUserFromLocalStorage();
    router.push('/'); // Redirect to home page after sign-out
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setBg(window.scrollY > 50);
    });
  }, []);

  return (
    <nav
      className={`${
        bg ? "bg-black text-white" : "bg-white text-black border-b border-dark border-solid"
      } fixed left-0 top-0 z-10 hidden lg:block font-opensans text-secondary w-full transition-all duration-200`}
    >
      <div className="md:px-8 px-4 mx-auto items-center flex justify-between">
        <div className="w-[240px] items-center">
          <Image
            src="https://res.cloudinary.com/dgms1mpbw/image/upload/v1699825747/ARTS_BY_ART_LOGO_ydpcyd_nzavtb.png"
            width={370}
            height={0}
            alt="logo"
          />
        </div>
        <div className="font-opensans flex gap-[30px] ">
          <Link href="/" className="relative group">
            <p className="text-[15px]">Home</p>
            <span className="absolute inset-x-0  bottom-0  bg-primary transition-transform transform translate-y-full group-hover:border boder-solid border-primary group-hover:translate-x-0 ease-in-out "></span>
          </Link>
          
            <Link href="/shop" className="relative group">
              <p className="text-[15px]">Shop</p>
              <span
                className="absolute inset-x-0  bottom-0  bg-primary transition-transform transform translate-y-full group-hover:border boder-solid border-primary group-hover:translate-x-0 ease-in-out "
              ></span>
            </Link>
         
          <Link href="/contact" className="relative group">
            <p className="text-[15px]">Contact Us</p>
            <span className="absolute inset-x-0  bottom-0  bg-primary transition-transform transform translate-y-full group-hover:border boder-solid border-primary group-hover:translate-x-0 ease-in-out "></span>
          </Link>
          <Link href="/suppliers" className="relative group">
            <p className="text-[15px]">Become a Supplier</p>
            <span className="absolute inset-x-0  bottom-0  bg-primary transition-transform transform translate-y-full group-hover:border boder-solid border-primary group-hover:translate-x-0 ease-in-out "></span>
          </Link>
          <Link href="/ICregister/Registration" className="relative group">
            <p className="text-[15px]">Become an IC</p>
            <span className="absolute inset-x-0  bottom-0  bg-primary transition-transform transform translate-y-full group-hover:border boder-solid border-primary group-hover:translate-x-0 ease-in-out "></span>
          </Link>
          <Link href="/authentication/login" className="relative group">
            <p className="text-[15px]">Admin</p>
            <span className="absolute inset-x-0  bottom-0  bg-primary transition-transform transform translate-y-full group-hover:border boder-solid border-primary group-hover:translate-x-0 ease-in-out "></span>
          </Link>
          <Link href="/contact" className="relative group">
            <p className="text-[15px]">Mission</p>
            <span className="absolute inset-x-0  bottom-0  bg-primary transition-transform transform translate-y-full group-hover:border boder-solid border-primary group-hover:translate-x-0 ease-in-out "></span>
          </Link>
          <Link href="/contact" className="relative group">
            <p className="text-[15px]">Team</p>
            <span className="absolute inset-x-0  bottom-0  bg-primary transition-transform transform translate-y-full group-hover:border boder-solid border-primary group-hover:translate-x-0 ease-in-out "></span>
          </Link>
        </div>
        <div className="hidden lg:flex items-center justify-end gap-[28px]">
          <Link href="/contact">
            <SearchIcon className="fill-white" />
          </Link>
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
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                     
                        Profile
                 
                    </Link>
                    <Link href="/track" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                     
                    Dashboard
              
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
            <Link href="/">
             <AccountIcon2 className="fill-white" />
            </Link>
          )}
          {/* <Link href="/about">
            <CartIcon className="fill-white " />
          </Link> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
