import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "@/utils/Localstorage";
import { useCustomContext } from "@/context/Customcontext";
import dynamic from "next/dynamic";
import Login from "../authentication/Login";
import { useModal } from "@/context/ModalContext";
import Register from "../authentication/Register";
import { useWishlist } from "@/context/WishlistContext";
import { AccountIcon2, SearchIcon, WishlistIcon, DeleteIcon } from "@/icon";

const SearchPanel = dynamic(() => import("./SearchPanel"), { ssr: false });

const Navbar = () => {
  const [bg, setBg] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const router = useRouter();
  const { isRightOpen, openRight } = useCustomContext();
  const { openModal, closeModal, isModalOpen, modalContent } = useModal();
  const { wishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    setLoggedInUser(getUserFromLocalStorage());

    const handleScroll = () => {
      setBg(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogin = () => {
    openModal(<Login closeModal={closeModal} />);
  };

  const handleRegister = () => {
    openModal(<Register closeModal={closeModal} />);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleWishlist = () => {
    setWishlistOpen(!wishlistOpen);
  };

  const handleSignOut = () => {
    removeUserFromLocalStorage();
    router.push("/");
  };

  return (
    <>
      <nav
        className={`${
          bg
            ? "bg-black text-white"
            : "bg-white text-black border-b border-dark border-solid"
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
              <span className="absolute inset-x-0 bottom-0 bg-primary transition-transform transform translate-y-full group-hover:border border-solid border-primary group-hover:translate-x-0 ease-in-out"></span>
            </Link>

            <Link href="/shop" className="relative group">
              <p className="text-[15px]">Shop</p>
              <span className="absolute inset-x-0 bottom-0 bg-primary transition-transform transform translate-y-full group-hover:border border-solid border-primary group-hover:translate-x-0 ease-in-out"></span>
            </Link>

            <Link href="/contact" className="relative group">
              <p className="text-[15px]">Contact Us</p>
              <span className="absolute inset-x-0 bottom-0 bg-primary transition-transform transform translate-y-full group-hover:border border-solid border-primary group-hover:translate-x-0 ease-in-out"></span>
            </Link>

            <Link href="/ICregister/Registration" className="relative group">
              <p className="text-[15px]">Become an IC</p>
              <span className="absolute inset-x-0 bottom-0 bg-primary transition-transform transform translate-y-full group-hover:border border-solid border-primary group-hover:translate-x-0 ease-in-out"></span>
            </Link>

            <Link href="/about" className="relative group">
              <p className="text-[15px]">About Us</p>
              <span className="absolute inset-x-0 bottom-0 bg-primary transition-transform transform translate-y-full group-hover:border border-solid border-primary group-hover:translate-x-0 ease-in-out"></span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center justify-end gap-[28px] relative">
            <div onClick={openRight}>
              <SearchIcon className="fill-white" />
            </div>
            <div className="relative group">
              <button
                type="button"
                className="focus:outline-none"
                onClick={toggleWishlist}
              >
                <WishlistIcon className="fill-gray-500" />
              </button>
              {wishlistOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {wishlist.length === 0 ? (
                      <p className="block px-4 py-2 text-sm text-gray-700">
                        Wishlist is empty
                      </p>
                    ) : (
                      wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center px-4 py-2 border-b border-gray-200"
                        >
                          <Link href={`/products/${item.slug}`} className="flex">
                            <div className="flex-shrink-0 mr-2">
                              <Image
                                src={item.images[0]} // Replace with your image source
                                alt={item.title}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{item.title}</p>
                              <p className="text-sm text-gray-500">
                                {item.price}
                              </p>
                            </div>
                          </Link>
                          <button
                            className="ml-auto focus:outline-none"
                            onClick={() => removeFromWishlist(item.id)}
                          >
                            <DeleteIcon className="fill-black" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 bg-red-500 text-white rounded-full text-[10px]">
                  {wishlist.length}
                </span>
              )}
            </div>
            {loggedInUser ? (
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
          </div>
        </div>
      </nav>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white h-[50%] w-[50%] p-6 rounded-lg shadow-lg">
            {modalContent}
          </div>
        </div>
      )}
      {isRightOpen && <SearchPanel />}
    </>
  );
};

export default Navbar;
