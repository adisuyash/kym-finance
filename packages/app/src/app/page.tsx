'use client'

import Link from 'next/link'
import { Connect } from '@/components/Connect'

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-[#1a1a24] flex flex-col'>
      {/* Header */}
      <header className='border-b border-[#2a2a35] bg-[#0f0f16] relative z-50'>
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

            <nav className='hidden md:flex items-center space-x-8 relative z-10'>
              {['deposit', 'split', 'swap', 'redeem'].map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  className='text-white/70 hover:text-white transition-colors cursor-pointer'
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
            </nav>
            <Connect />
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className='flex flex-1 items-center justify-center pt-0 -mt-16'>
        <section className='container mx-auto px-6 text-center'>
          {/* Live Badge */}
          <div className='inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg text-sm font-medium text-white/80 bg-[#2a2a35]'>
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping'></span>
              <span className='relative inline-flex h-2 w-2 rounded-full bg-green-500'></span>
            </span>
            Live on U2U Testnet
          </div>

          {/* Title */}
          <h1 className='mb-6 text-4xl font-bold leading-tight text-white md:text-6xl'>
            Split U2U, <span className='text-indigo-400'>Maximize Yield</span>
          </h1>

          {/* Subtitle */}
          <p className='mx-auto mb-6 max-w-2xl text-xl text-white/60'>
            A DeFi protocol to trade and maximize returns from yield-generating assets.
          </p>

          {/* Action Buttons */}
          <div className='flex flex-wrap justify-center gap-4'>
            {[
              { href: '/deposit', label: 'Start Depositing' },
              { href: '/split', label: 'Split Tokens' },
              { href: '/swap', label: 'Swap Tokens' },
              { href: '/redeem', label: 'Redeem & Claim' },
            ].map((btn) => (
              <Link
                key={btn.href}
                href={btn.href}
                className='px-8 py-4 rounded-lg font-semibold text-white transition-all bg-[#2a2a35] hover:bg-indigo-500 hover:opacity-90'
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Stats (hidden for now) */}
      <section className='hidden'>
        <div className='mx-auto mb-16 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-4'>
          {[
            { value: '5%', label: 'APY' },
            { value: '0.3%', label: 'Trading Fee' },
            { value: '1 Year', label: 'Maturity' },
            { value: 'U2U', label: 'Native' },
          ].map((stat) => (
            <div key={stat.label} className='rounded-lg bg-[#0f0f16] p-6'>
              <div className='mb-2 text-3xl font-bold text-white'>{stat.value}</div>
              <div className='text-sm text-white/50'>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-[#2a2a35] py-6'>
        <div className='container mx-auto px-6 text-center'>
          <p className='text-sm text-white/50'>
            Built with ❤️ for VietBUIDL Hackathon · Powered by U2U Network
          </p>
        </div>
      </footer>
    </div>
  )
}
