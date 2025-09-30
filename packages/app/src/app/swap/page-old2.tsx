'use client'

import React from 'react'
import { PageLayout } from '@/components/PageLayout'
import { SwapSection } from '@/components/SwapSection'
import { PortfolioOverview } from '@/components/PortfolioOverview'
import { PriceChart } from '@/components/PriceChart'
import { useAccount, useChainId, useBalance, useReadContract } from 'wagmi'
import { getContractAddresses, YIELD_SPLITTER_ABI } from '@/config/contracts'

export default function SwapPage() {
  const { address } = useAccount()
  const chainId = useChainId()
  const contracts = getContractAddresses(chainId)

  // Get balances
  const { data: u2uBalance } = useBalance({
    address: address,
  })

  const { data: wu2uBalance } = useBalance({
    address: address,
    token: contracts.wrappedU2U,
  })

  // Get user position
  const { data: userPosition } = useReadContract({
    address: contracts.yieldSplitter,
    abi: YIELD_SPLITTER_ABI,
    functionName: 'getUserPosition',
    args: address ? [address] : undefined,
  })

  return (
    <PageLayout>
      <div className='container mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-3 space-y-6'>
            <div className='mb-8'>
              <h1 className='text-4xl font-bold mb-3 text-white'>Swap Tokens</h1>
              <p className='text-white/60 text-lg'>Trade PT and YT tokens with advanced yield-based pricing</p>
            </div>
            <SwapSection />
            <PriceChart />
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            <PortfolioOverview
              userPosition={userPosition as readonly [bigint, bigint, bigint] | undefined}
              u2uBalance={u2uBalance}
              wu2uBalance={wu2uBalance}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
