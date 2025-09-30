'use client'

import { useAccount, useChainId, useBalance, useReadContract } from 'wagmi'
import { getContractAddresses, YIELD_SPLITTER_ABI } from '@/config/contracts'

/**
 * Centralized hook for contract data with caching
 * Prevents duplicate calls across components
 */
export function useContractData() {
  const { address } = useAccount()
  const chainId = useChainId()
  const contracts = getContractAddresses(chainId)

  // Get native balance
  const { data: u2uBalance, isLoading: isLoadingU2U } = useBalance({
    address: address,
    query: {
      enabled: !!address,
    },
  })

  // Get wU2U balance
  const { data: wu2uBalance, isLoading: isLoadingWU2U } = useBalance({
    address: address,
    token: contracts.wrappedU2U,
    query: {
      enabled: !!address,
    },
  })

  // Get user position (PT, YT, claimable yield)
  const { data: userPosition, isLoading: isLoadingPosition } = useReadContract({
    address: contracts.yieldSplitter,
    abi: YIELD_SPLITTER_ABI,
    functionName: 'getUserPosition',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Get contract stats
  const { data: contractStats, isLoading: isLoadingStats } = useReadContract({
    address: contracts.yieldSplitter,
    abi: YIELD_SPLITTER_ABI,
    functionName: 'getContractStats',
    query: {
      enabled: true,
    },
  })

  const isLoading = isLoadingU2U || isLoadingWU2U || isLoadingPosition || isLoadingStats

  return {
    address,
    chainId,
    contracts,
    u2uBalance,
    wu2uBalance,
    userPosition,
    contractStats,
    isLoading,
  }
}
