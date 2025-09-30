'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useBalance, useAccount, useChainId } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { toast } from 'react-hot-toast'
import { getContractAddresses, WRAPPED_U2U_ABI } from '../config/contracts'

export function DepositSection() {
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit')

  const { address } = useAccount()
  const chainId = useChainId()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Get contract addresses for current chain
  const contracts = getContractAddresses(chainId)

  // Get balances
  const { data: u2uBalance } = useBalance({ address })
  const { data: wu2uBalance } = useBalance({
    address,
    token: contracts.wrappedU2U,
  })

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      await writeContract({
        address: contracts.wrappedU2U,
        abi: WRAPPED_U2U_ABI,
        functionName: 'deposit',
        value: parseEther(depositAmount),
      })

      toast.success('Deposit transaction submitted!')
      setDepositAmount('')
    } catch (error) {
      console.error('Deposit failed:', error)
      toast.error('Deposit failed. Please try again.')
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      await writeContract({
        address: contracts.wrappedU2U,
        abi: WRAPPED_U2U_ABI,
        functionName: 'withdraw',
        args: [parseEther(withdrawAmount)],
      })

      toast.success('Withdrawal transaction submitted!')
      setWithdrawAmount('')
    } catch (error) {
      console.error('Withdrawal failed:', error)
      toast.error('Withdrawal failed. Please try again.')
    }
  }

  const setMaxDeposit = () => {
    if (u2uBalance) {
      // Leave some U2U for gas fees
      const maxAmount = u2uBalance.value - parseEther('0.01')
      if (maxAmount > 0) {
        setDepositAmount(formatEther(maxAmount))
      }
    }
  }

  const setMaxWithdraw = () => {
    if (wu2uBalance) {
      setWithdrawAmount(formatEther(wu2uBalance.value))
    }
  }

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title flex items-center gap-2'>
          <span className='text-2xl'></span>
          U2U Wrapper
        </h2>

        {/* Balance Display */}
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div className='stat bg-base-200 rounded-lg'>
            <div className='stat-title'>U2U Balance</div>
            <div className='stat-value text-lg'>
              {u2uBalance ? parseFloat(formatEther(u2uBalance.value)).toFixed(4) : '0.0000'}
            </div>
          </div>
          <div className='stat bg-base-200 rounded-lg'>
            <div className='stat-title'>wU2U Balance</div>
            <div className='stat-value text-lg'>
              {wu2uBalance ? parseFloat(formatEther(wu2uBalance.value)).toFixed(4) : '0.0000'}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className='tabs tabs-boxed mb-4'>
          <button
            className={`tab ${activeTab === 'deposit' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('deposit')}>
            Wrap U2U
          </button>
          <button
            className={`tab ${activeTab === 'withdraw' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('withdraw')}>
            Unwrap wU2U
          </button>
        </div>

        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <div className='space-y-4'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Amount (U2U)</span>
                <button className='label-text-alt link link-hover' onClick={setMaxDeposit}>
                  Max
                </button>
              </label>
              <input
                type='number'
                placeholder='0.0'
                className='input input-bordered'
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                step='0.0001'
                min='0'
              />
            </div>

            <div className='alert alert-info'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                className='stroke-current shrink-0 w-6 h-6'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
              </svg>
              <span>You will receive {depositAmount || '0'} wU2U tokens (1:1 ratio)</span>
            </div>

            <button
              className='btn btn-primary w-full'
              onClick={handleDeposit}
              disabled={!depositAmount || isPending || isConfirming || !address}>
              {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Wrap U2U → wU2U'}
            </button>
          </div>
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <div className='space-y-4'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Amount (wU2U)</span>
                <button className='label-text-alt link link-hover' onClick={setMaxWithdraw}>
                  Max
                </button>
              </label>
              <input
                type='number'
                placeholder='0.0'
                className='input input-bordered'
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                step='0.0001'
                min='0'
              />
            </div>

            <div className='alert alert-warning'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='stroke-current shrink-0 h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
              <span>You will receive {withdrawAmount || '0'} U2U (1:1 ratio)</span>
            </div>

            <button
              className='btn btn-secondary w-full'
              onClick={handleWithdraw}
              disabled={!withdrawAmount || isPending || isConfirming || !address}>
              {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Unwrap wU2U → U2U'}
            </button>
          </div>
        )}

        {!address && (
          <div className='alert alert-error'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='stroke-current shrink-0 h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span>Please connect your wallet to use this feature</span>
          </div>
        )}
      </div>
    </div>
  )
}
