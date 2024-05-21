"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import Link from 'next/link'

function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex justify-between py-4">
      <div className='flex justify-between items-center w-full px-4'>
        <div className='flex items-center space-x-4'>
          <Link href="/">
            <Image
              src="/logotext.svg"
              width={128}
              height={32}
              alt="Logo"
            />
          </Link>
          <Button variant="ghost">Règles</Button>
          <Button variant="ghost">Blog</Button>
        </div>
        <div className='flex space-x-2'>
          <Button variant="outline">Connexion</Button>
          <Button variant="default">Joue gratuitement</Button>
        </div>
      </div>
    </header>
  )
}

export default Header