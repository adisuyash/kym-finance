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
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-primary rounded-full'></div>
              <span className='font-medium'>PT-wU2U</span>
            </div>
            <div className='text-right'>
              <div className='font-semibold'>{parseFloat(formatEther(ptBalance)).toFixed(4)}</div>
              <div className='text-xs opacity-70'>Principal</div>
            </div>
          </div>

          {/* Yield Tokens */}
          <div className='flex justify-between items-center p-3 bg-base-200 rounded-lg'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-secondary rounded-full'></div>
              <span className='font-medium'>YT-wU2U</span>
            </div>
            <div className='text-right'>
              <div className='font-semibold'>{parseFloat(formatEther(ytBalance)).toFixed(4)}</div>
              <div className='text-xs opacity-70'>Yield</div>
            </div>
          </div>

          {/* Claimable Yield */}
          {claimableYield > 0n && (
            <div className='flex justify-between items-center p-3 bg-success/10 border border-success/20 rounded-lg'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-success rounded-full animate-pulse'></div>
                <span className='font-medium text-success'>Claimable Yield</span>
              </div>
              <div className='text-right'>
                <div className='font-semibold text-success'>{parseFloat(formatEther(claimableYield)).toFixed(6)}</div>
                <div className='text-xs opacity-70'>Ready to claim</div>
              </div>
            </div>
          )}
        </div>

        {/* Portfolio Allocation Chart */}
        <div className='mt-4'>
          <div className='text-sm font-medium mb-2'>Asset Allocation</div>
          <div className='w-full bg-base-200 rounded-full h-3 overflow-hidden'>
            {portfolioValue > 0 && (
              <div className='h-full flex'>
                {u2uBalance && u2uBalance.value > 0n && (
                  <div
                    className='bg-accent h-full'
                    style={{
                      width: `${(parseFloat(formatEther(u2uBalance.value)) / portfolioValue) * 100}%`,
                    }}></div>
                )}
                {wu2uBalance && wu2uBalance.value > 0n && (
                  <div
                    className='bg-info h-full'
                    style={{
                      width: `${(parseFloat(formatEther(wu2uBalance.value)) / portfolioValue) * 100}%`,
                    }}></div>
                )}
                {ptBalance > 0n && (
                  <div
                    className='bg-primary h-full'
                    style={{
                      width: `${(parseFloat(formatEther(ptBalance)) / portfolioValue) * 100}%`,
                    }}></div>
                )}
                {ytBalance > 0n && (
                  <div
                    className='bg-secondary h-full'
                    style={{
                      width: `${(parseFloat(formatEther(ytBalance)) / portfolioValue) * 100}%`,
                    }}></div>
                )}
                {claimableYield > 0n && (
                  <div
                    className='bg-success h-full'
                    style={{
                      width: `${(parseFloat(formatEther(claimableYield)) / portfolioValue) * 100}%`,
                    }}></div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className='grid grid-cols-2 gap-2 mt-4 text-xs'>
          <div className='stat bg-base-200 rounded p-2'>
            <div className='stat-title text-xs'>Yield Earning</div>
            <div className='stat-value text-sm'>{parseFloat(formatEther(ytBalance)).toFixed(2)}</div>
          </div>
          <div className='stat bg-base-200 rounded p-2'>
            <div className='stat-title text-xs'>Principal Protected</div>
            <div className='stat-value text-sm'>{parseFloat(formatEther(ptBalance)).toFixed(2)}</div>
          </div>
        </div>

        {/* Empty State */}
        {portfolioValue === 0 && (
          <div className='text-center py-8 opacity-50'>
            <div className='text-4xl mb-2'>🌱</div>
            <div className='text-sm'>No assets yet</div>
            <div className='text-xs'>Start by wrapping some U2U</div>
          </div>
        )}
      </div>
    </div>
  )
}
