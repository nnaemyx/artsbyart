import React from "react";
import Mobileheader from "./Mobileheader";
import {
  ContactIcon,
  HomeIcon,
  NotificationIcon,
  ProfileIcon,
  ShopIcon,
} from "@/icon";
import Link from "next/link";

const Mobilenav = () => {
  return (
    <div className="lg:hidden block">
      <Mobileheader />
      <div className="py-2 px-2 w-full md:hidden block z-10 text-dark bg-light shadow-md fixed bottom-0 left-0 h-[66px]">
        <div className="flex 375:gap-[4.3rem]  gap-[3.2rem] mx-auto justify-center 425:gap-[5.3rem]  items-center">
          <Link href="/" className="flex flex-col items-center">
            <span>
              <HomeIcon />
            </span>
            <p className=" text-[12px] ">Home</p>
          </Link>


          
          <Link href="/orders" className="flex flex-col items-center">
            <span className="text-center ">
              <ContactIcon />
            </span>
            <p className=" text-[12px] ">Orders</p>
          </Link>

          <Link href="/shop" className="flex flex-col items-center">
            <span>
              <ShopIcon />
            </span>
            <p className=" text-[12px] ">Shop</p>
          </Link>

          <Link href="/profile" className="flex flex-col items-center">
            <span>
              <ProfileIcon />
            </span>
            <p className=" text-[12px] ">Profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Mobilenav;
