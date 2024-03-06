import React, { useState } from "react";
import Link from "next/link";
import { DropUpIcon, DropdownIcon } from "@/icon";
import { useRouter } from "next/router";
import { menuItems } from "./ICsidebarlinks";

const ICsidebar = ({onTitleClick}) => {
  const [activeDropdowns, setActiveDropdowns] = useState({});

  const router = useRouter();

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
  return (
      <nav className="text-center">
        <ul className="mt-[3rem] leading-[4rem]">
          {menuItems.map(({ href, title, icon, subItems }) => (
            <li className="text-[14px] font-gilmerregular" key={title}>
              {subItems ? (
                <div className="relative">
                  <div
                    className={` px-6 w-full  cursor-pointer`}
                    onClick={() => {
                        onTitleClick(title); 
                        toggleDropdown(title);
                      }}                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
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
                    <ul className="bg-white">
                      {subItems.map(
                        ({ href: subHref, title: subTitle, icon: subIcon }) => (
                          <li key={subTitle}>
                            <Link href={subHref}>
                              <div
                                className={`flex items-center justify-start gap-2 px-16 w-full cursor-pointer ${
                                  isSubItemActive({ href: subHref }, title)
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
                    className={`flex items-center gap-2 px-6   w-full cursor-pointer ${
                      router.asPath === href && "bg-primary fill-white  text-white"
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
  );
};

export default ICsidebar;
