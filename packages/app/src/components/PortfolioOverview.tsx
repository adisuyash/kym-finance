'use client'

import { formatEther } from 'viem'

interface Balance {
  value: bigint
  decimals: number
  symbol: string
}

interface PortfolioOverviewProps {
  userPosition?: readonly [bigint, bigint, bigint] // [ptBalance, ytBalance, claimableYield]
  u2uBalance?: Balance
  wu2uBalance?: Balance
}

export function PortfolioOverview({ userPosition, u2uBalance, wu2uBalance }: PortfolioOverviewProps) {
  const ptBalance = userPosition ? userPosition[0] : 0n
  const ytBalance = userPosition ? userPosition[1] : 0n
  const claimableYield = userPosition ? userPosition[2] : 0n

  const totalPortfolioValue = () => {
    const u2u = u2uBalance ? parseFloat(formatEther(u2uBalance.value)) : 0
    const wu2u = wu2uBalance ? parseFloat(formatEther(wu2uBalance.value)) : 0
    const pt = parseFloat(formatEther(ptBalance))
    const yt = parseFloat(formatEther(ytBalance))
    const yield_ = parseFloat(formatEther(claimableYield))

    return u2u + wu2u + pt + yt + yield_
  }

  const portfolioValue = totalPortfolioValue()

  return (
    <div className='bg-[#0f0f16] rounded-lg p-6'>
      <h3 className='text-lg font-semibold text-white mb-4'>Portfolio Overview</h3>

      {/* Horizontal Grid of Assets */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        {/* Total Portfolio Value */}
        <div className='bg-[#1a1a24] rounded-lg p-4 border border-indigo-500/20'>
          <div className='text-xs text-white/50 mb-1'>Total Value</div>
          <div className='text-2xl font-bold text-white'>{portfolioValue.toFixed(2)}</div>
          <div className='text-xs text-white/40 mt-1'>U2U</div>
        </div>

        {/* Native U2U */}
        <div className='bg-[#1a1a24] rounded-lg p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-2 h-2 bg-cyan-400 rounded-full'></div>
            <span className='text-xs text-white/50'>U2U</span>
          </div>
          <div className='text-xl font-bold text-white'>
            {u2uBalance ? parseFloat(formatEther(u2uBalance.value)).toFixed(4) : '0.0000'}
          </div>
          <div className='text-xs text-white/40 mt-1'>Native</div>
        </div>

        {/* Wrapped U2U */}
        <div className='bg-[#1a1a24] rounded-lg p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
            <span className='text-xs text-white/50'>wU2U</span>
          </div>
          <div className='text-xl font-bold text-white'>
            {wu2uBalance ? parseFloat(formatEther(wu2uBalance.value)).toFixed(4) : '0.0000'}
          </div>
          <div className='text-xs text-white/40 mt-1'>Wrapped</div>
        </div>

        {/* Principal Tokens */}
        <div className='bg-[#1a1a24] rounded-lg p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-2 h-2 bg-indigo-400 rounded-full'></div>
            <span className='text-xs text-white/50'>PT</span>
          </div>
          <div className='text-xl font-bold text-white'>{parseFloat(formatEther(ptBalance)).toFixed(4)}</div>
          <div className='text-xs text-white/40 mt-1'>Principal</div>
        </div>

        {/* Yield Tokens */}
        <div className='bg-[#1a1a24] rounded-lg p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
            <span className='text-xs text-white/50'>YT</span>
          </div>
          <div className='text-xl font-bold text-white'>{parseFloat(formatEther(ytBalance)).toFixed(4)}</div>
          <div className='text-xs text-white/40 mt-1'>Yield</div>
        </div>
      </div>

      {/* Claimable Yield Banner */}
      {claimableYield > 0n && (
        <div className='mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
            <span className='text-sm text-white/70'>Claimable Yield</span>
          </div>
          <span className='text-lg font-bold text-green-400'>{parseFloat(formatEther(claimableYield)).toFixed(6)} wU2U</span>
        </div>
      )}
    </div>
  )
}
