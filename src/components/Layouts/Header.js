import { NotfIcon, SearchIcon } from '@/icon'
import React from 'react'

const Header = ({ clickedTitle }) => {
  return (
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <div>
        <h1 className='text-[25px] font-semibold'>{clickedTitle}</h1>
        </div>
        <div className='flex items-center gap-4'>
          <NotfIcon  className="w-[24px] h-[30px]"/>
          <SearchIcon className="w-[24px] h-[30px]"/>
        </div>
      </div>
    </div>
  )
}

export default Header