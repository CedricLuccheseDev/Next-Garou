import React from 'react'
import Image from 'next/image'

function Header() {
  return (
    <div className={"sticky top-0 z-10 w-full p-4 flex items-center justify-center duration-300 "}>
      <div className={"w-full " + 1280}>
        <div className="flex items-center justify-between h-8 w-full">
          <div className="h-full flex items-center space-x-8">
            <div className="h-full">
              <Image
                src="/logotext.svg"
                width={128}
                height={32}
                alt="Logo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header