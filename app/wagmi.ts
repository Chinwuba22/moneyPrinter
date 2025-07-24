// app/config/wagmi.ts (or lib/wagmi.ts)
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

export const config = getDefaultConfig({
  appName: 'My dApp',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // get this from https://cloud.walletconnect.com
  chains: [sepolia],
  transports: {
    [sepolia.id]: publicProvider(),
  },
})
