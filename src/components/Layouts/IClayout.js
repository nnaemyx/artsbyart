import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Head from "next/head";
import Image from "next/image";
import Sidebar from "./Sidebar";
import ICsidebar from "./ICsidebar";
import ICheader from "./ICheader";
import ICHeader from "./ICheaderMobile";

export default function ICLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [clickedTitle, setClickedTitle] = useState("");

  const handleTitleClick = (title) => {
    setClickedTitle(title);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <>
     <Head>
        <title>Artsbyart IC</title>
        <meta name="description" content="Artsbyart is a premier creative agency specialized in branding and print solutions, serving businesses of all sizes and across all industries. We partner with our clients to develop, maintain, and enhance their brands through strategic planning, innovative design, and effective communication" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <div className="min-h-screen font-opensans bg-white flex">
      <aside className="w-[232px] hidden lg:block lg:border-y-black text-center mx-auto text-secondary bg-white border-r border-solid 2xl:w-[263px]">
        <Image
          src="https://res.cloudinary.com/dgms1mpbw/image/upload/v1699825747/ARTS_BY_ART_LOGO_ydpcyd_nzavtb.png"
          width={170}
          height={0}
          alt="logo"
          className=""
        />
        <ICsidebar onTitleClick={handleTitleClick} />
      </aside>
      <main className="flex-1 lg:mt-8 px-6 flex flex-col">
        <ICheader clickedTitle={clickedTitle} />
        <ICHeader />
        {children}
      </main>
    </div>
  </>
  )
}

