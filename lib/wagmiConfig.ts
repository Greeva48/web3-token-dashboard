import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

if (!projectId && typeof window !== 'undefined') {
  console.warn(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect may not work.'
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: 'Web3 Token Dashboard',
  projectId: projectId || 'placeholder-project-id',
  chains: [sepolia],
  ssr: true,
});
