'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { PageLayout } from '@/components/PageLayout'
import { DepositSection } from '@/components/DepositSection'
import { PortfolioOverview } from '@/components/PortfolioOverview'
import { useAccount, useChainId, useBalance } from 'wagmi'
import { getContractAddresses } from '@/config/contracts'

// Dynamic import for TradingView widget (client-side only)
const TradingViewWidget = dynamic(() => import('@/components/TradingViewWidget'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center h-full bg-[#0f0f16] rounded-lg'>
      <p className='text-white/50'>Loading chart...</p>
    </div>
  ),
})

export default function DepositPage() {
  const { address } = useAccount()
  const chainId = useChainId()
  const contracts = getContractAddresses(chainId)

  // Get U2U and wU2U balances
  const { data: u2uBalance } = useBalance({
    address: address,
  })

  const { data: wu2uBalance } = useBalance({
    address: address,
    token: contracts.wrappedU2U,
  })

  return (
    <PageLayout>
      <div className='container mx-auto px-6 py-12'>
        {/* Page Header */}
        <div className='mb-6'>
          <h1 className='text-4xl font-bold mb-3 text-white'>Deposit U2U</h1>
          <p className='text-white/60 text-lg'>Wrap your U2U into wU2U to start yield splitting</p>
        </div>

        {/* Portfolio Overview - Horizontal */}
        <div className='mb-6'>
          <PortfolioOverview u2uBalance={u2uBalance} wu2uBalance={wu2uBalance} />
        </div>

        {/* Main Layout - Chart on Left, Actions on Right */}
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
          {/* TradingView Chart - Takes 2 columns */}
          <div className='xl:col-span-2 h-[700px]'>
            <div className='bg-[#0f0f16] rounded-lg p-4 h-full'>
              <TradingViewWidget />
            </div>
          </div>

          {/* Right Side - Deposit Actions */}
          <div className='h-[700px]'>
            <DepositSection />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
