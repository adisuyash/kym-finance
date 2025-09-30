'use client'

import Link from 'next/link'
import { Connect } from './Connect'
import { PropsWithChildren } from 'react'

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <div className='min-h-screen bg-[#1a1a24] flex flex-col'>
      {/* Header - Consistent across all pages */}
      <header className='border-b border-[#2a2a35] bg-[#0f0f16]'>
        <div className='container mx-auto px-6'>
          <div className='flex h-20 items-center justify-between'>
            <Link href='/' className='flex items-center gap-3 text-2xl font-bold text-white hover:opacity-80 transition-opacity'>
              <img 
                src='/favicon.png' 
                alt='Kym Finance' 
                className='w-7 h-7 rounded-full object-cover'
              />
              Kym Finance
            </Link>

            <nav className='hidden md:flex items-center space-x-8'>
              {['deposit', 'split', 'swap', 'redeem'].map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  className='text-white/70 hover:text-white transition-colors'
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
            </nav>
            
            <Connect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1'>
        {children}
      </main>
    </div>
  )
}
