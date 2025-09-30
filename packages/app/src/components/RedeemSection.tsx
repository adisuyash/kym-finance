'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount, useChainId } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { toast } from 'react-hot-toast'
import { getContractAddresses, YIELD_SPLITTER_ABI, TOKEN_ABI } from '../config/contracts'

export function RedeemSection() {
  const [redeemAmount, setRedeemAmount] = useState('')
  const [redeemType, setRedeemType] = useState<'both' | 'pt-only'>('both')

  const { address } = useAccount()
  const chainId = useChainId()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Get contract addresses for current chain
  const contracts = getContractAddresses(chainId)

  // Get user position
  const { data: userPosition } = useReadContract({
    address: contracts.yieldSplitter,
    abi: YIELD_SPLITTER_ABI,
    functionName: 'getUserPosition',
    args: address ? [address] : undefined,
  })

  // Get maturity timestamp
  const { data: maturity } = useReadContract({
    address: contracts.yieldSplitter,
    abi: YIELD_SPLITTER_ABI,
    functionName: 'maturity',
  })

  // Get individual token balances
  const { data: ptBalance } = useReadContract({
    address: contracts.principalToken,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: ytBalance } = useReadContract({
    address: contracts.yieldToken,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const isMatured = maturity ? Date.now() / 1000 >= Number(maturity) : false
  const claimableYield = userPosition && Array.isArray(userPosition) && userPosition.length >= 3 ? userPosition[2] : 0n
  const ptBalanceFormatted = ptBalance ? formatEther(ptBalance) : '0'
  const ytBalanceFormatted = ytBalance ? formatEther(ytBalance) : '0'

  const handleRedeemBoth = async () => {
    if (!redeemAmount || parseFloat(redeemAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      await writeContract({
        address: contracts.yieldSplitter,
        abi: YIELD_SPLITTER_ABI,
        functionName: 'redeemBeforeMaturity',
        args: [parseEther(redeemAmount)],
      })

      toast.success('Redeem transaction submitted!')
      setRedeemAmount('')
    } catch (error) {
      console.error('Redeem failed:', error)
      toast.error('Redeem failed. Please try again.')
    }
  }

  const handleRedeemPT = async () => {
    if (!redeemAmount || parseFloat(redeemAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      await writeContract({
        address: contracts.yieldSplitter,
        abi: YIELD_SPLITTER_ABI,
        functionName: 'redeemPTAfterMaturity',
        args: [parseEther(redeemAmount)],
      })

      toast.success('PT redeem transaction submitted!')
      setRedeemAmount('')
    } catch (error) {
      console.error('PT redeem failed:', error)
      toast.error('PT redeem failed. Please try again.')
    }
  }

  const handleClaimYield = async () => {
    try {
      await writeContract({
        address: contracts.yieldSplitter,
        abi: YIELD_SPLITTER_ABI,
        functionName: 'claimYield',
      })

      toast.success('Yield claim transaction submitted!')
    } catch (error) {
      console.error('Yield claim failed:', error)
      toast.error('Yield claim failed. Please try again.')
    }
  }

  const setMaxRedeemAmount = () => {
    if (redeemType === 'both') {
      const minBalance = ptBalance && ytBalance ? (ptBalance < ytBalance ? ptBalance : ytBalance) : 0n
      if (minBalance > 0n) {
        setRedeemAmount(formatEther(minBalance))
      }
    } else {
      if (ptBalance && ptBalance > 0n) {
        setRedeemAmount(formatEther(ptBalance))
      }
    }
  }

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title flex items-center gap-2'>
          <span className='text-2xl'></span>
          Redeem Tokens
        </h2>

        {/* Token Balances */}
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div className='stat bg-primary/10 rounded-lg'>
            <div className='stat-title text-primary'>PT Balance</div>
            <div className='stat-value text-lg'>{parseFloat(ptBalanceFormatted).toFixed(4)}</div>
            <div className='stat-desc'>Principal Tokens</div>
          </div>
          <div className='stat bg-secondary/10 rounded-lg'>
            <div className='stat-title text-secondary'>YT Balance</div>
            <div className='stat-value text-lg'>{parseFloat(ytBalanceFormatted).toFixed(4)}</div>
          </div>
        </div>

        {/* Claimable Yield */}
        {claimableYield > 0n ? (
          <div className='flex items-center justify-between p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20'>
            <div className='flex items-center gap-3'>
              <svg className='w-5 h-5 text-green-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <div>
                <p className='text-sm font-medium text-white'>Yield Ready: {formatEther(claimableYield)} wU2U</p>
              </div>
            </div>
            <button onClick={handleClaimYield} disabled={isPending || isConfirming} className='px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors'>
              Claim
            </button>
          </div>
        ) : (
          <div className='flex items-center gap-2 p-3 mb-4 rounded-lg bg-blue-500/10 border border-blue-500/20'>
            <svg className='w-4 h-4 text-blue-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <span className='text-sm text-white/70'>No yield to claim yet</span>
          </div>
        )}
        {/* Maturity Status - Compact */}
        <div className={`flex items-center gap-2 p-3 mb-4 rounded-lg ${isMatured ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
          <svg className='w-4 h-4 text-white/70' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          <span className='text-sm text-white/70'>
            {isMatured ? 'Matured: Redeem PT only' : 'Pre-maturity: Need both PT+YT'}
          </span>
        </div>

        {/* Redeem Type Selection */}
        <div className='form-control mb-4'>
          <label className='label'>
            <span className='label-text'>Redemption Type</span>
          </label>
          <div className='flex gap-2'>
            <button
              className={`btn btn-sm flex-1 ${redeemType === 'both' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setRedeemType('both')}
              disabled={isMatured}>
              PT + YT → wU2U
            </button>
            <button
              className={`btn btn-sm flex-1 ${redeemType === 'pt-only' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setRedeemType('pt-only')}
              disabled={!isMatured}>
              PT Only → wU2U
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className='form-control mb-4'>
          <label className='label'>
            <span className='label-text'>Amount to Redeem ({redeemType === 'both' ? 'PT+YT' : 'PT'})</span>
            <button className='label-text-alt link link-hover' onClick={setMaxRedeemAmount}>
              Max
            </button>
          </label>
          <input
            type='number'
            placeholder='0.0'
            className='input input-bordered'
            value={redeemAmount}
            onChange={(e) => setRedeemAmount(e.target.value)}
          />
        </div>

        {/* Redemption Preview - Compact */}
        {redeemAmount && parseFloat(redeemAmount) > 0 && (
          <div className='p-3 mb-4 rounded-lg bg-blue-500/10 border border-blue-500/20'>
            <p className='text-sm text-white/70 mb-1'>You will receive:</p>
            <p className='text-lg font-semibold text-white'>{redeemAmount} wU2U</p>
            <p className='text-xs text-white/50 mt-1'>
              {redeemType === 'both' && `Burns ${redeemAmount} PT + ${redeemAmount} YT`}
              {redeemType === 'pt-only' && `Burns ${redeemAmount} PT`}
            </p>
          </div>
        )}

        {/* Redemption Action Button */}
        <div className='space-y-2'>
          {redeemType === 'both' && (
            <button
              className='btn btn-primary w-full'
              onClick={handleRedeemBoth}
              disabled={!redeemAmount || isPending || isConfirming || !address || parseFloat(redeemAmount) <= 0}>
              {isPending
                ? 'Confirming...'
                : isConfirming
                  ? 'Processing...'
                  : `Redeem ${redeemAmount || '0'} PT+YT for wU2U`}
            </button>
          )}

          {redeemType === 'pt-only' && (
            <button
              className='btn btn-primary w-full'
              onClick={handleRedeemPT}
              disabled={!redeemAmount || isPending || isConfirming || !address || parseFloat(redeemAmount) <= 0}>
              {isPending
                ? 'Confirming...'
                : isConfirming
                  ? 'Processing...'
                  : `Redeem ${redeemAmount || '0'} PT for wU2U`}
            </button>
          )}
        </div>

        {!address && (
          <div className='flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20'>
            <svg className='w-4 h-4 text-red-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <span className='text-sm text-white/70'>Connect wallet to continue</span>
          </div>
        )}

        {/* Educational Info */}
        <div className='collapse collapse-arrow bg-base-200 mt-4'>
          <input type='checkbox' />
          <div className='collapse-title text-sm font-medium'>💡 Understanding redemption options</div>
          <div className='collapse-content text-sm'>
            <div className='space-y-2'>
              <p>
                <strong>Before Maturity:</strong> You need both PT and YT tokens to redeem wU2U. This burns both tokens
                and returns the original deposit.
              </p>
              <p>
                <strong>After Maturity:</strong> You can redeem PT tokens individually for wU2U at 1:1 ratio. YT tokens
                no longer earn yield.
              </p>
              <p>
                <strong>Yield Claiming:</strong> YT holders can claim accumulated yield at any time. Yield is paid in
                wU2U.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
