import Head from "next/head";
import React from "react";
import Navbar from "../Homepage/Navbar";
import Mobilenav from "../Homepage/Mobilenav";

const Layout = ({ children }) => {
  return (
    <div>
     <Head>
        <title>Artsbyart</title>
        <meta name="description" content="Artsbyart is a premier creative agency specialized in branding and print solutions, serving businesses of all sizes and across all industries. We partner with our clients to develop, maintain, and enhance their brands through strategic planning, innovative design, and effective communication" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Mobilenav />
      <main className="lg:mt-[7rem]">{children}</main>
    </div>
  );
};

export default Layout;
