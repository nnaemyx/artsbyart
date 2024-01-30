import { SearchIcon } from "@/icon";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { logOut } from "@/utils/functions";
import { account } from "@/utils/appwrite";
import Novu from "../Chat/Novu";

const Header = ({ clickedTitle }) => {
  const router = useRouter();
  const [user, setUser] = useState({});

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
    <div className="w-full">
      <div className="flex justify-between">
        <div>
        <h1 className='text-[25px] font-semibold'>{clickedTitle}</h1>
        </div>
        <div className="flex items-center space-x-5">
          <Novu />
          <SearchIcon />
          <button
            onClick={() => logOut(router)}
            className="bg-[#314484] text-gray-50 py-2 px-6 rounded hover:bg-red-500"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
