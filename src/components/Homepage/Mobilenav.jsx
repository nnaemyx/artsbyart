import React, { useEffect, useState } from "react";
import Mobileheader from "./Mobileheader";
import { ContactIcon, HomeIcon, ShopIcon, WishlistIcon } from "@/icon"; // Adjust icon imports as needed
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

const Mobilenav = () => {
  const { wishlist } = useWishlist();
  const [localWishlist, setLocalWishlist] = useState([]);

  useEffect(() => {
    // Load wishlist from localStorage on component mount
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setLocalWishlist(savedWishlist);
  }, []);

  useEffect(() => {
    // Update localStorage when wishlist changes
    localStorage.setItem("wishlist", JSON.stringify(localWishlist));
  }, [localWishlist]);

  return (
    <div className="lg:hidden block">
      <Mobileheader />
      <div className="py-2 px-2 w-full md:hidden block z-10 text-dark bg-light shadow-md fixed bottom-0 left-0 h-[66px]">
        <div className="flex 375:gap-[4.3rem] gap-[3.2rem] mx-auto justify-center 425:gap-[5.3rem] items-center">
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

          <div className="relative group">
            <Link href="/wishlist" className="flex flex-col items-center">
              <span>
                <WishlistIcon />
              </span>
              <p className=" text-[12px] ">Wishlist</p>
              {localWishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {localWishlist.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mobilenav;
