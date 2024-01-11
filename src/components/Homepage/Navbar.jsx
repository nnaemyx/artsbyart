import { AccountIcon2, CartIcon, MessageIcon, SearchIcon } from "@/icon";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [bg, setBg] = useState(false);

  useEffect(() => {
    // add event listener
    window.addEventListener("scroll", () => {
      // when scrollY is bigger than 50px setBg to true, else false
      return window.scrollY > 50 ? setBg(true) : setBg(false);
    });
  });

  return (
    <nav
      className={`${
        // if bg is true
        bg
          ? "bg-black top-0 text-white  z-10"
          : // if bg is false
            "bg-white border-b border-dark border-solid top-0 z-10"
      }
      fixed left-0  z-10 hidden lg:block font-opensans  text-secondary w-full transition-all  duration-200`}
    >
      <div className="md:px-8 px-4  mx-auto items-center  flex justify-between">
      <div className=" w-[240px] items-center">
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
          <Link href="/authentication/AdminLogin" className="relative group">
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
            <MessageIcon className="fill-white " />
          </Link>
          <Link href="/contact">
            <SearchIcon className="fill-white" />
          </Link>
          <Link href="/about">
            <AccountIcon2 className="fill-white " />
          </Link>
          <Link href="/about">
            <CartIcon className="fill-white " />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
