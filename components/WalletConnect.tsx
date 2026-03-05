'use client';

import { useState, useCallback } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';

function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getConnectionErrorMessage(error: Error | null): string | null {
  if (!error) return null;
  const message = error.message?.toLowerCase() ?? '';
  if (message.includes('user rejected') || message.includes('rejected')) {
    return 'Connection rejected. Please try again.';
  }
  if (message.includes('connector') && message.includes('not found')) {
    return 'Wallet not found. Please install a supported wallet.';
  }
  if (message.includes('not installed') || message.includes('no provider')) {
    return 'Wallet not installed. Please install MetaMask or another supported wallet.';
  }
  return error.message;
}

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { error: connectError } = useConnect();
  const [copied, setCopied] = useState(false);

  const copyAddress = useCallback(async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [address]);

  const connectionError = getConnectionErrorMessage(connectError ?? null);

  return (
    <div className="flex flex-col items-center gap-3">
      <ConnectButton
        showBalance={false}
        chainStatus="icon"
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
      {isConnected && address && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-400 font-mono">
            {truncateAddress(address)}
          </p>
          <button
            type="button"
            onClick={copyAddress}
            className="rounded px-2 py-1 text-xs text-gray-500 hover:text-accent hover:bg-surface-muted border border-transparent hover:border-border transition-colors"
            title="Copy address"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      {connectionError && (
        <p className="text-sm text-red-400 text-center max-w-full">
          {connectionError}
        </p>
      )}
    </div>
  );
}
