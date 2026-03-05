'use client';

import { useAccount, useBalance, useReadContract } from 'wagmi';
import { TOKEN_ADDRESS, ERC20_ABI } from '@/lib/contract';
import { formatUnits } from 'viem';

const DEFAULT_DECIMALS = 18;

function formatEthBalance(value: bigint | undefined): string {
  if (value === undefined) return '0';
  const formatted = formatUnits(value, 18);
  const num = parseFloat(formatted);
  if (num === 0) return '0';
  if (num >= 1e6) return num.toExponential(4);
  return num.toLocaleString('en-US', {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  });
}

export function TokenBalance() {
  const { address, isConnected } = useAccount();
  const { data: ethBalance, isLoading: ethBalanceLoading } = useBalance({
    address: address ?? undefined,
  });
  const { data: balance, isLoading: balanceLoading } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });
  const { data: decimals } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });
  const { data: symbol } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  if (!isConnected || !address) {
    return (
      <p className="text-gray-500 text-sm">Connect a wallet to view balance.</p>
    );
  }

  const decimalsNum = decimals ?? DEFAULT_DECIMALS;
  const tokenFormatted =
    balance !== undefined ? formatUnits(balance, decimalsNum) : '0';
  const tokenDisplay =
    tokenFormatted.length > 12
      ? Number(tokenFormatted).toExponential(4)
      : Number(tokenFormatted).toLocaleString('en-US', {
          maximumFractionDigits: 6,
          minimumFractionDigits: 0,
        });

  const isLoading = ethBalanceLoading || balanceLoading;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="text-gray-400 text-sm">Loading balance…</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-lg font-semibold text-white font-mono">
        {formatEthBalance(ethBalance?.value)} <span className="text-accent font-sans">ETH</span>
      </p>
      <p className="text-lg font-semibold text-white font-mono">
        {tokenDisplay} <span className="text-accent font-sans">{(symbol as string) ?? 'TOKEN'}</span>
      </p>
    </div>
  );
}
