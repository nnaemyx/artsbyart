import React from "react";
import Mobileheader from "./Mobileheader";
import { ContactIcon, HomeIcon, NotificationIcon, ProfileIcon, ShopIcon } from "@/icon";
import Link from "next/link";

const Mobilenav = () => {
  return (
    <div className="lg:hidden block">
      <Mobileheader />
      <div className="py-2 px-2 w-full md:hidden block z-10 text-dark bg-light shadow-md fixed bottom-0 left-0 h-[66px]">
        <div className="flex 375:gap-[2.1rem]  gap-[2.4rem] 425:gap-[3.4rem]  items-center">
          <div className="flex flex-col items-center">
            <span className="text-center ">
              <ContactIcon />
            </span>
            <p className=" text-[12px] ">Contact us</p>
          </div>

          <div className="flex flex-col items-center">
            <span>
              <NotificationIcon />
            </span>
            <Link href="/">
            <p className=" text-[12px] ">Chats</p>
            </Link>
          </div>

          <div className="flex flex-col items-center">
            <span>
              <HomeIcon />
            </span>
            <p className=" text-[12px] ">Home</p>
          </div>

          <div className="flex flex-col items-center">
          <span>
            <ShopIcon/>
          </span>
            <p className=" text-[12px] ">Shop</p>
          </div>

          <div className="flex flex-col items-center">
            <span>
           <ProfileIcon/>
            </span>
            <p className=" text-[12px] ">Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mobilenav;
