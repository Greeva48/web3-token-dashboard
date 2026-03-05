'use client';

import { useAccount } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const SEPOLIA_CHAIN_ID = sepolia.id;

export function NetworkIndicator() {
  const { isConnected, chain } = useAccount();
  const isWrongNetwork = isConnected && chain && chain.id !== SEPOLIA_CHAIN_ID;

  if (!isConnected) {
    return (
      <p className="text-sm text-gray-500" data-testid="network-indicator">
        Wallet not connected
      </p>
    );
  }

  return (
    <div className="space-y-1" data-testid="network-indicator">
      <p className="text-sm text-gray-400">
        Connected Network: <span className="text-accent font-medium">{chain?.name ?? 'Unknown'}</span>
      </p>
      {isWrongNetwork && (
        <p className="text-sm text-amber-400 font-medium">
          Please switch to Sepolia test network.
        </p>
      )}
    </div>
  );
}
