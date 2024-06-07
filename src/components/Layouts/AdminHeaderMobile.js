import { AccountIcon2, DropdownIcon, DropUpIcon, SearchIcon } from "@/icon";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logOut } from "@/utils/functions";
import { account } from "@/utils/appwrite";
import Novu from "../Chat/Novu";
import Image from "next/image";
import { menuItems } from "./SidebarLinks";

const AdminHeader = ({ onTitleClick }) => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [isButtonOpen, setIsButtonOpen] = useState(false);
  const [activeDropdowns, setActiveDropdowns] = useState({});

  const toggleDropdown = (dropdownId) => {
    setActiveDropdowns((prev) => ({
      ...prev,
      [dropdownId]: !prev[dropdownId],
    }));
  };

  const isSubItemActive = (subItem, dropdownId) => {
    // Determine if the subItem is active based on the current route
    return subItem.href === router.asPath && activeDropdowns[dropdownId];
  };

  const toggleDropdownButton = () => {
    setIsButtonOpen(!isButtonOpen);
  };
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    async function authStatus() {
      try {
        const user = await account.get();
        setUser(user);
      } catch (err) {}
    }
    authStatus();
  }, []);
  return (
    <div className="w-full lg:hidden block">
      <div className="flex justify-between">
        <Image
          src="https://res.cloudinary.com/dgms1mpbw/image/upload/v1699825747/ARTS_BY_ART_LOGO_ydpcyd_nzavtb.png"
          width={150}
          height={0}
          alt="logo"
          className=""
        />
        <div className="flex items-center space-x-2">
          <Novu />
          <button
            onClick={toggleDropdownButton}
            className=" md:hidden px-2 rounded flex items-center"
          >
            <span className="rounded-full ">
              <AccountIcon2 className="" />
            </span>
          </button>
          {showMenu ? (
            <button onClick={toggleMenu} className="lg:hidden flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path>
              </svg>
            </button>
          ) : (
            <button onClick={toggleMenu} className="lg:hidden flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path d="M3 4H21V6H3V4ZM3 11H15V13H3V11ZM3 18H21V20H3V18Z"></path>
              </svg>
            </button>
          )}

          {isButtonOpen && (
            <div className="absolute bg-dark h-[136px] top-[4rem] py-4 px-4 w-auto right-0 mt-2  text-white  rounded-md shadow-lg">
              <button
                onClick={() => logOut(router)}
                className="bg-[#314484] text-gray-50 py-2 px-6 rounded hover:bg-red-500"
              >
                Sign out
              </button>
            </div>
          )}
          {showMenu && (
            <div>
              <div className="absolute z-10  bg-light h-auto py-4 space-y-6 left-0  top-0 w-[206px] text-white text-center  shadow-lg">
                <div className="flex flex-col  md:flex-row flex-1">
                  <nav className="text-center">
                    <ul className=" leading-[5rem]">
                      {menuItems.map(({ href, title, icon, subItems }) => (
                        <li
                          className="text-[14px] font-gilmerregular"
                          key={title}
                        >
                          {subItems ? (
                            <div className="relative">
                              <div
                                className={` px-6 w-full  cursor-pointer`}
                                onClick={() => {
                                  onTitleClick(title);
                                  toggleDropdown(title);
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex text-black items-center gap-2">
                                    <span>{icon}</span>
                                    <span>{title}</span>
                                  </div>
                                  <span className="ml-2">
                                    {activeDropdowns[title] ? (
                                      <DropUpIcon className="fill-black" />
                                    ) : (
                                      <DropdownIcon className="fill-black" />
                                    )}
                                  </span>
                                </div>
                              </div>
                              {activeDropdowns[title] && (
                                <ul className="bg-black">
                                  {subItems.map(
                                    ({
                                      href: subHref,
                                      title: subTitle,
                                      icon: subIcon,
                                    }) => (
                                      <li key={subTitle}>
                                        <Link href={subHref}>
                                          <div
                                            className={`flex items-center justify-start gap-2 px-4 w-full cursor-pointer ${
                                              isSubItemActive(
                                                { href: subHref },
                                                title
                                              )
                                                ? "bg-primary  text-white"
                                                : ""
                                            }`}
                                          >
                                            {subIcon}
                                            {subTitle}
                                          </div>
                                        </Link>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : (
                            <Link href={href}>
                              <p
                                className={`flex items-center gap-2 px-6 text-black  w-full cursor-pointer ${
                                  router.asPath === href &&
                                  "bg-primary fill-white  text-white"
                                }`}
                                onClick={() => onTitleClick(title)}
                              >
                                <span>{icon}</span>
                                {title}
                              </p>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
