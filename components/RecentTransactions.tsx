'use client';

const SEPOLIA_ETHERSCAN = 'https://sepolia.etherscan.io/tx';
const MAX_RECENT = 5;

function shortenHash(hash: string): string {
  if (hash.length <= 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export interface RecentTransactionsProps {
  transactions: readonly `0x${string}`[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const list = transactions.slice(0, MAX_RECENT);

  if (list.length === 0) {
    return (
      <p className="text-gray-500 text-sm">No recent transactions.</p>
    );
  }

  return (
    <ul className="space-y-2" aria-label="Recent transactions">
      {list.map((hash) => (
        <li
          key={hash}
          className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-surface-muted border border-border"
        >
          <span className="font-mono text-sm text-gray-300 truncate">
            {shortenHash(hash)}
          </span>
          <span className="flex items-center gap-2 shrink-0">
            <span className="text-accent" aria-hidden="true">✔</span>
            <a
              href={`${SEPOLIA_ETHERSCAN}/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline"
            >
              View on Etherscan
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}
