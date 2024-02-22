import React from 'react'
import Image from 'next/image'
import { Button } from '@nextui-org/button'

function Header() {
  return (
    <div className={"container w-full mx-auto p-4 flex items-center justify-between duration-200 h-24"}>
      <div className='flex items-center justify-center space-x-2'>
        <Image
          src="/logotext.svg"
          width={156}
          height={36}
          alt="Logo"
        />
        <div className='text-white'>Blog</div>
      </div>
      <div className='w-full'></div>
      <div className='flex items-center justify-center space-x-2'>
          <Button color="primary">Se connecter</Button>
          <Button className='text-white'>S inscrire</Button>
      </div>
    </div>
  )
}

export default Header