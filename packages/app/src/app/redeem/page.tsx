'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { PageLayout } from '@/components/PageLayout'
import { RedeemSection } from '@/components/RedeemSection'
import { PortfolioOverview } from '@/components/PortfolioOverview'
import { useAccount, useChainId, useBalance, useReadContract } from 'wagmi'
import { getContractAddresses, YIELD_SPLITTER_ABI } from '@/config/contracts'

const TradingViewWidget = dynamic(() => import('@/components/TradingViewWidget'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center h-full bg-[#0f0f16] rounded-lg'>
      <p className='text-white/50'>Loading chart...</p>
    </div>
  ),
})

export default function RedeemPage() {
  const { address } = useAccount()
  const chainId = useChainId()
  const contracts = getContractAddresses(chainId)

  const { data: u2uBalance } = useBalance({ address: address, query: { refetchInterval: 3000 } })
  const { data: wu2uBalance } = useBalance({ address: address, token: contracts.wrappedU2U, query: { refetchInterval: 3000 } })

  const { data: userPosition } = useReadContract({
    address: contracts.yieldSplitter,
    abi: YIELD_SPLITTER_ABI,
    functionName: 'getUserPosition',
    args: address ? [address] : undefined,
  })

  return (
    <PageLayout>
      <div className='container mx-auto px-6 py-12'>
        <div className='mb-6'>
          <h1 className='text-4xl font-bold mb-3 text-white'>Redeem & Claim</h1>
          <p className='text-white/60 text-lg'>Redeem your tokens and claim accumulated yield</p>
        </div>

        <div className='mb-6'>
          <PortfolioOverview
            
            u2uBalance={u2uBalance}
            wu2uBalance={wu2uBalance}
          />
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
          <div className='xl:col-span-2 h-[700px]'>
            <div className='bg-[#0f0f16] rounded-lg p-4 h-full'>
              <TradingViewWidget />
            </div>
          </div>
          <div className='h-[700px]'>
            <RedeemSection />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
