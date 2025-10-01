'use client'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

const U2U_TESTNET_CHAIN_ID = 2484

export function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const isWrongNetwork = isConnected && chainId !== U2U_TESTNET_CHAIN_ID

  useEffect(() => {
    if (isWrongNetwork) {
      toast.error(
        `Wrong network detected! Please switch to ETH Nebulas Testnet (Chain ID: ${U2U_TESTNET_CHAIN_ID})`,
        {
          duration: 6000,
          position: 'top-center',
        }
      )
    }
  }, [isWrongNetwork])

  if (isWrongNetwork) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Wrong Network</h2>
            <p className="text-gray-600 mb-6">
              You&apos;re currently connected to <span className="font-semibold">Chain ID: {chainId}</span>
              <br />
              Please switch to <span className="font-semibold text-emerald-600">U2U Nebulas Testnet</span>
            </p>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-emerald-900 mb-2">Network Details:</h3>
            <div className="text-sm text-emerald-800 space-y-1">
              <p>
                <span className="font-medium">Name:</span> ETH Nebulas Testnet
              </p>
              <p>
                <span className="font-medium">Chain ID:</span> 2484
              </p>
              <p>
                <span className="font-medium">RPC:</span> https://rpc-nebulas-testnet.u2u.xyz/
              </p>
              <p>
                <span className="font-medium">Explorer:</span> https://testnet.u2uscan.xyz/
              </p>
            </div>
          </div>

          <button
            onClick={() => switchChain?.({ chainId: U2U_TESTNET_CHAIN_ID })}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-3"
          >
            Switch to ETH Nebulas Testnet
          </button>

          <p className="text-xs text-gray-500">
            Need testnet U2U?{' '}
            <a
              href="https://faucet.u2u.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 underline"
            >
              Get from faucet
            </a>
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
