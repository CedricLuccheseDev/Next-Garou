import React from 'react'
import Image from 'next/image'
import { Button } from '@nextui-org/button'

function Header() {
  return (
    <div className={"container mx-auto flex duration-200 backdrop-blur-md border-gray-800 border-1 rounded-lg p-2"}>
      <div className='flex items-center space-x-4'>
        <Image
          src="/logotext.svg"
          width={128}
          height={32}
          alt="Logo"
        />
        <div className='text-white'>Blog</div>
      </div>
      <div className='w-full'></div>
      <div className='flex items-center justify-center space-x-2'>
          <Button color="default">Se conneter</Button>
          <Button color="primary">S inscrire</Button>
      </div>
    </div>
  )
}

export default Header