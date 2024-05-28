"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Header() {
  return (
    <header className="sticky flex justify-between py-4 rounded-lg backdrop-filter backdrop-blur-2xl bg-black/10 top-50">
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
          <Link href="/game">
            <Button variant="ghost">Party</Button>
          </Link>
          <Button variant="ghost">Rules</Button>
          <Button variant="ghost">Blog</Button>
        </div>
        <div className='flex space-x-2'>
          <Button variant="outline">Log-in</Button>
          <Button variant="default">Sign-up for free</Button>
        </div>
      </div>
    </header>
  )
}

export default Header