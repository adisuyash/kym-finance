'use client'

import React from 'react'
import { PageLayout } from '@/components/PageLayout'
import { RedeemSection } from '@/components/RedeemSection'
import { PortfolioOverview } from '@/components/PortfolioOverview'
import { useAccount, useChainId, useBalance, useReadContract } from 'wagmi'
import { getContractAddresses, YIELD_SPLITTER_ABI } from '@/config/contracts'

export default function RedeemPage() {
  const { address } = useAccount()
  const chainId = useChainId()
  const contracts = getContractAddresses(chainId)

  // Get balances
  const { data: ethBalance } = useBalance({
    address: address,
  })

  const { data: wethBalance } = useBalance({
    address: address,
    token: contracts.weth,
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
          <div className='lg:col-span-3'>
            <div className='mb-8'>
              <h1 className='text-4xl font-bold mb-3 text-white'>Redeem & Claim</h1>
              <p className='text-white/60 text-lg'>Redeem your tokens and claim accumulated yield</p>
            </div>
            <RedeemSection />
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            <PortfolioOverview
              userPosition={userPosition as readonly [bigint, bigint, bigint] | undefined}
              ethBalance={ethBalance}
              wethBalance={wethBalance}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
