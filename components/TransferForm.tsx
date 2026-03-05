'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { parseUnits, type Address } from 'viem';
import { TOKEN_ADDRESS, ERC20_ABI } from '@/lib/contract';

const DEFAULT_DECIMALS = 18;

function isValidAddress(value: string): value is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function getTransferButtonText(
  isConnected: boolean,
  isWritePending: boolean,
  isConfirming: boolean,
  canSubmit: boolean
): string {
  if (!isConnected) return 'Connect Wallet to Transfer';
  if (isWritePending) return 'Confirm in Wallet';
  if (isConfirming) return 'Confirming...';
  if (canSubmit) return 'Transfer Tokens';
  return 'Transfer Tokens';
}

export interface TransferFormProps {
  onTransactionSuccess?: (hash: `0x${string}`) => void;
}

export function TransferForm({ onTransactionSuccess }: TransferFormProps) {
  const { isConnected } = useAccount();
  const queryClient = useQueryClient();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: hash ?? undefined,
  });

  useEffect(() => {
    if (isSuccess && hash) {
      queryClient.invalidateQueries({ queryKey: ['readContract'] });
      onTransactionSuccess?.(hash);
    }
  }, [isSuccess, hash, queryClient, onTransactionSuccess]);

  const isPending = isWritePending || isConfirming;
  const hasValidInputs =
    recipient &&
    amount &&
    isValidAddress(recipient) &&
    Number(amount) > 0;
  const canSubmit = isConnected && hasValidInputs && !isPending;
  const isButtonDisabled = !isConnected || isPending || !hasValidInputs;

  const buttonText = getTransferButtonText(
    isConnected,
    isWritePending,
    isConfirming,
    !!canSubmit
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      const amountWei = parseUnits(amount, DEFAULT_DECIMALS);
      writeContract({
        address: TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipient as Address, amountWei],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setRecipient('');
    setAmount('');
    resetWrite();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-400 mb-1">
          Recipient address
        </label>
        <input
          id="recipient"
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value.trim())}
          className="w-full px-4 py-3 rounded-lg bg-surface-muted border border-border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isPending || !isConnected}
        />
        {recipient && !isValidAddress(recipient) && (
          <p className="mt-1 text-xs text-red-400">Invalid Ethereum address.</p>
        )}
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
          Amount
        </label>
        <input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          className="w-full px-4 py-3 rounded-lg bg-surface-muted border border-border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isPending || !isConnected}
        />
      </div>
      {writeError && (
        <p className="text-sm text-red-400">{writeError.message}</p>
      )}
      {isPending && (
        <div className="flex items-center gap-2 text-accent text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
          <span>{isConfirming ? 'Confirming…' : 'Confirm in wallet…'}</span>
        </div>
      )}
      {isSuccess && hash && (
        <div className="rounded-lg bg-accent-muted border border-accent/30 p-3 space-y-1">
          <p className="text-sm font-medium text-accent">Transaction sent</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-accent hover:underline break-all"
          >
            {hash}
          </a>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-white"
            >
              Send another
            </button>
          </div>
        </div>
      )}
      <button
        type="submit"
        disabled={isButtonDisabled}
        className="w-full py-3 rounded-lg font-medium bg-accent text-surface hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {buttonText}
      </button>
    </form>
  );
}
