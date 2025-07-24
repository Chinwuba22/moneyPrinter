'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { nftGatedTokenAbi } from '../lib/abi'
import { parseUnits } from 'viem'
import { useState } from 'react'

const TOKEN_ADDRESS = '0x3470d960A1B70eda5BB3D815157e767FCB31cA9C'
const NFT_ADDRESS = '0xa25e0af7dd580fce7121fd78e95c3f3bee258e8f'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data: lastMintTime, refetch } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: nftGatedTokenAbi, 
    functionName: 'lastMintTime',
    args: [address],
    query: { enabled: !!address },
  })

  const { data: nftBalance } = useReadContract({
    address: NFT_ADDRESS,
    abi: [
      {
        "name": "balanceOf",
        "type": "function",
        "inputs": [{ "name": "owner", "type": "address" }],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
      }
    ],
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address },
  })

  const { writeContract, isPending } = useWriteContract()

  const handleMint = async () => {
    try {
      setError(null)
      const hash = await writeContract({
        address: TOKEN_ADDRESS,
        abi: nftGatedTokenAbi,
        functionName: 'mint',
        args: [],
})  
      setTxHash(hash)
      await refetch()
    } catch (err: any) {
      setError(err?.shortMessage || 'Mint failed')
    }
  }

  const canMint =
    isConnected &&
    Number(nftBalance || 0) > 0 &&
    (!lastMintTime || Number(lastMintTime) + 86400 < Date.now() / 1000)

  return (
    <div className="min-h-screen flex flex-col justify-between items-center p-6 relative bg-gradient-to-br from-purple-700 via-indigo-800 to-indigo-900 text-white">
      {/* Wallet top-left */}
      <div className="absolute top-4 left-4">
        <ConnectButton />
      </div>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-grow mt-10">
        <h1 className="text-4xl font-bold mb-4 text-center">MONEY PRINTER FOR BOUNDLESS BERRIES</h1>

        {isConnected && (
          <>
            <div className="text-center mb-4">
              <p className="text-lg">NFTs Owned: {Number(nftBalance || 0)}</p>
              <p>
                Last Mint:{' '}
                {lastMintTime
                  ? new Date(Number(lastMintTime) * 1000).toLocaleString()
                  : 'Never'}
              </p>
            </div>

            <button
              className="px-6 py-2 bg-green-600 rounded text-white disabled:bg-gray-600"
              onClick={handleMint}
              disabled={!canMint || isPending}
            >
              {isPending ? 'Minting...' : 'Mint 1 Token'}
            </button>

            {txHash && (
              <a
                href={`https://basescan.org/tx/${txHash}`}
                className="mt-2 text-blue-500 underline"
                target="_blank"
                rel="noreferrer"
              >
                View on BaseScan
              </a>
            )}

            {error && <p className="mt-2 text-red-500">{error}</p>}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-6">
        <p>Disclaimer: For fun purposes only — This is not tradable</p>
        <p className="mt-1">
          Made with ❤️ by{' '}
          <a
            href="https://x.com/X_Drained"
            className="text-blue-500 underline"
            target="_blank"
            rel="noreferrer"
          >
            Drained
          </a>
        </p>
      </footer>
    </div>
  )
}