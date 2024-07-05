import { AccountIcon2, DropdownIcon, DropUpIcon, SearchIcon } from "@/icon";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logOut } from "@/utils/functions";
import { account } from "@/utils/appwrite";
import Novu from "../Chat/Novu";
import Image from "next/image";
import { menuItems } from "./ICsidebarlinks";

const ICHeader = ({ onTitleClick }) => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [isButtonOpen, setIsButtonOpen] = useState(false);
  const [activeDropdowns, setActiveDropdowns] = useState({});
  const [isVerified, setIsVerified] = useState(false);


  useEffect(() => {
    const fetchICData = async () => {
      try {
        // Get authenticated user data
        const user = await account.get();
        setUser(user);

        // Fetch IC documents from the database
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_REGISTRATION_COLLECTION_ID
        );

        // Check if the authenticated user ID matches the user_id attribute in any of the IC documents
        const verifiedIC = response.documents.find(ic => ic.user_id === user.$id);
        setIsVerified(verifiedIC ? verifiedIC.is_verified : false);
        console.log(verifiedIC)
      } catch (error) {
        console.error("Error fetching IC data:", error);
      }
    };

    fetchICData();
  }, []);

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
        <div className="flex items-center space-x-5">
          {isVerified ? (
            <div className="flex gap-2">
              <p>Verified</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="rgba(70,146,221,1)"
              >
                <path d="M10.007 2.10377C8.60544 1.65006 7.08181 2.28116 6.41156 3.59306L5.60578 5.17023C5.51004 5.35763 5.35763 5.51004 5.17023 5.60578L3.59306 6.41156C2.28116 7.08181 1.65006 8.60544 2.10377 10.007L2.64923 11.692C2.71404 11.8922 2.71404 12.1078 2.64923 12.308L2.10377 13.993C1.65006 15.3946 2.28116 16.9182 3.59306 17.5885L5.17023 18.3942C5.35763 18.49 5.51004 18.6424 5.60578 18.8298L6.41156 20.407C7.08181 21.7189 8.60544 22.35 10.007 21.8963L11.692 21.3508C11.8922 21.286 12.1078 21.286 12.308 21.3508L13.993 21.8963C15.3946 22.35 16.9182 21.7189 17.5885 20.407L18.3942 18.8298C18.49 18.6424 18.6424 18.49 18.8298 18.3942L20.407 17.5885C21.7189 16.9182 22.35 15.3946 21.8963 13.993L21.3508 12.308C21.286 12.1078 21.286 11.8922 21.3508 11.692L21.8963 10.007C22.35 8.60544 21.7189 7.08181 20.407 6.41156L18.8298 5.60578C18.6424 5.51004 18.49 5.35763 18.3942 5.17023L17.5885 3.59306C16.9182 2.28116 15.3946 1.65006 13.993 2.10377L12.308 2.64923C12.1078 2.71403 11.8922 2.71404 11.692 2.64923L10.007 2.10377ZM6.75977 11.7573L8.17399 10.343L11.0024 13.1715L16.6593 7.51465L18.0735 8.92886L11.0024 15.9999L6.75977 11.7573Z"></path>
              </svg>
            </div>
          ) : (
            <div className="flex gap-2">
              <p>Not Verified</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M10.0073 2.10365C8.60568 1.64993 7.08206 2.28104 6.41181 3.59294L5.60603 5.17011C5.51029 5.35751 5.35787 5.50992 5.17048 5.60566L3.5933 6.41144C2.2814 7.08169 1.6503 8.60532 2.10401 10.0069L2.64947 11.6919C2.71428 11.8921 2.71428 12.1077 2.64947 12.3079L2.10401 13.9929C1.6503 15.3945 2.28141 16.9181 3.5933 17.5883L5.17048 18.3941C5.35787 18.4899 5.51029 18.6423 5.60603 18.8297L6.41181 20.4068C7.08206 21.7187 8.60569 22.3498 10.0073 21.8961L11.6923 21.3507C11.8925 21.2859 12.108 21.2859 12.3082 21.3507L13.9932 21.8961C15.3948 22.3498 16.9185 21.7187 17.5887 20.4068L18.3945 18.8297C18.4902 18.6423 18.6426 18.4899 18.83 18.3941L20.4072 17.5883C21.7191 16.9181 22.3502 15.3945 21.8965 13.9929L21.351 12.3079C21.2862 12.1077 21.2862 11.8921 21.351 11.6919L21.8965 10.0069C22.3502 8.60531 21.7191 7.08169 20.4072 6.41144L18.83 5.60566C18.6426 5.50992 18.4902 5.3575 18.3945 5.17011L17.5887 3.59294C16.9185 2.28104 15.3948 1.64993 13.9932 2.10365L12.3082 2.6491C12.108 2.71391 11.8925 2.71391 11.6923 2.6491L10.0073 2.10365ZM8.19283 4.50286C8.41624 4.06556 8.92412 3.8552 9.39132 4.00643L11.0763 4.55189C11.6769 4.74632 12.3236 4.74632 12.9242 4.55189L14.6092 4.00643C15.0764 3.8552 15.5843 4.06556 15.8077 4.50286L16.6135 6.08004C16.9007 6.64222 17.3579 7.09946 17.9201 7.38668L19.4973 8.19246C19.9346 8.41588 20.145 8.92375 19.9937 9.39095L19.4483 11.076C19.2538 11.6766 19.2538 12.3232 19.4483 12.9238L19.9937 14.6088C20.145 15.076 19.9346 15.5839 19.4973 15.8073L17.9201 16.6131C17.3579 16.9003 16.9007 17.3576 16.6135 17.9197L15.8077 19.4969C15.5843 19.9342 15.0764 20.1446 14.6092 19.9933L12.9242 19.4479C12.3236 19.2535 11.6769 19.2535 11.0763 19.4479L9.39132 19.9933C8.92412 20.1446 8.41624 19.9342 8.19283 19.4969L7.38705 17.9197C7.09983 17.3576 6.64258 16.9003 6.08041 16.6131L4.50323 15.8073C4.06593 15.5839 3.85556 15.076 4.0068 14.6088L4.55226 12.9238C4.74668 12.3232 4.74668 11.6766 4.55226 11.076L4.0068 9.39095C3.85556 8.92375 4.06593 8.41588 4.50323 8.19246L6.0804 7.38668C6.64258 7.09946 7.09983 6.64222 7.38705 6.08004L8.19283 4.50286ZM6.75984 11.7573L11.0025 15.9999L18.0736 8.92885L16.6594 7.51464L11.0025 13.1715L8.17406 10.343L6.75984 11.7573Z"></path>
              </svg>
            </div>
          )}
       
        </div>
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

export default ICHeader;
