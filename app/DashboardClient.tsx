'use client';

import { useState, useCallback } from 'react';
import { WalletConnect } from '@/components/WalletConnect';
import { TokenBalance } from '@/components/TokenBalance';
import { SwapInterface } from '@/components/SwapInterface';
import { TransferForm } from '@/components/TransferForm';
import { RecentTransactions } from '@/components/RecentTransactions';
import { NetworkIndicator } from '@/components/NetworkIndicator';

const MAX_RECENT_TXS = 5;

export default function DashboardClient() {
  const [recentTxHashes, setRecentTxHashes] = useState<`0x${string}`[]>([]);

  const handleTransactionSuccess = useCallback((hash: `0x${string}`) => {
    setRecentTxHashes((prev) => [hash, ...prev].slice(0, MAX_RECENT_TXS));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="rounded-2xl bg-surface-elevated border border-border shadow-card shadow-glow p-6 md:p-8 space-y-8">
          <header className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Web3 Token Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
              Sepolia · ERC20
            </p>
            <div className="pt-2">
              <NetworkIndicator />
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Wallet
            </h2>
            <WalletConnect />
          </section>

          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Balance
            </h2>
            <TokenBalance />
          </section>

          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Swap
            </h2>
            <SwapInterface />
          </section>

          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Transfer
            </h2>
            <TransferForm onTransactionSuccess={handleTransactionSuccess} />
          </section>

          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Recent Transactions
            </h2>
            <RecentTransactions transactions={recentTxHashes} />
          </section>
        </div>
        <p className="text-center text-gray-500 text-xs mt-6">
          Connect your wallet on Sepolia to view balance and send tokens.
        </p>
      </div>
    </main>
  );
}
