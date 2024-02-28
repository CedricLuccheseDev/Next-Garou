"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex justify-between border-b border-b-accent py-4">
      <div className='container flex justify-between items-center max-w-[1280px] w-full'>
        <div className='flex items-center space-x-4'>
          <Image
            src="/logotext.svg"
            width={128}
            height={32}
            alt="Logo"
          />
          <div className='text-white'>Rules</div>
          <div className='text-white'>Blog</div>
        </div>
        <div className='flex space-x-2'>
          <Button onClick={() => setTheme('light')} variant="outline">Connexion</Button>
          <Button onClick={() => setTheme('dark')} variant="default">Joue gratuitement</Button>
        </div>
      </div>
    </header>
  )
}

export default Header