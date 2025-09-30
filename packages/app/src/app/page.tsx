'use client'

import Link from 'next/link'
import { Connect } from '@/components/Connect'

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-[#1a1a24] flex flex-col'>
      {/* Header */}
      <header className='border-b border-[#2a2a35] bg-[#0f0f16]'>
        <div className='container mx-auto px-6'>
          <div className='flex h-20 items-center justify-between'>
            <Link href='/' className='text-2xl font-bold text-white'>
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

      {/* Hero */}
      <main className='flex flex-1 items-center justify-center pt-0'>
        <section className='container mx-auto px-6 text-center'>
          {/* Live Badge */}
          <div className='inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg text-sm font-medium text-white/80 bg-[#2a2a35]'>
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping'></span>
              <span className='relative inline-flex h-2 w-2 rounded-full bg-green-500'></span>
            </span>
            Live on U2U Testnet
          </div>

          {/* Subtitle */}
          <p className='mx-auto mb-6 max-w-2xl text-xl text-white/60'>
            A DeFi protocol to trade and maximize returns from yield-generating assets.
          </p>

          {/* Title */}
          <h1 className='mb-12 text-5xl font-bold leading-tight text-white md:text-7xl'>
            Split U2U, <span className='text-indigo-400'>Maximize Yield</span>
          </h1>

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
    </div>
  )
}
