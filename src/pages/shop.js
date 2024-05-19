import React from 'react'
import Link from "next/link";
import Allproducts from '@/components/Shop/Allproducts';


const shop = () => {
  return (
    <div className="mt-[9rem] px-8">
    <div>
      <div className="text-[13px] hidden md:flex font-opensans">
        <Link href="/">
          <span className="text-gray-600">Home </span>
        </Link>
         / Shop
      </div>
      <div className="mt-[3rem]">
        <h1 className="text-center font-futura font-semibold uppercase md:text-[48px] text-[36px] lg:text-[56px]">Shop</h1>
        <Allproducts/>
      </div>
    </div>
  </div>
  )
}

export default shop