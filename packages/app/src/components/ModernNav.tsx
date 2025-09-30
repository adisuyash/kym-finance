'use client'

import Link from 'next/link'
import { Connect } from './Connect'

export function ModernNav() {
  return (
    <header className='sticky top-0 z-50 backdrop-blur-lg border-b border-white/10' style={{ background: 'rgba(55, 54, 67, 0.8)' }}>
      <div className='container mx-auto px-6'>
        <div className='flex items-center justify-between h-20'>
          <Link href='/' className='flex items-center space-x-3 group'>
            <div className='text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>
              Kym Finance
            </div>
          </Link>
          
          <nav className='hidden md:flex items-center space-x-1'>
            <Link href='/deposit' className='px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all'>
              Deposit
            </Link>
            <Link href='/split' className='px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all'>
              Split
            </Link>
            <Link href='/swap' className='px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all'>
              Swap
            </Link>
            <Link href='/redeem' className='px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all'>
              Redeem
            </Link>
          </nav>

          <div className='flex items-center space-x-4'>
            <Connect />
          </div>
        </div>
      </div>
    </header>
  )
}
