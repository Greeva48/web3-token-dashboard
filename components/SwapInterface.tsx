'use client';

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';

const MOCK_ETH_USDC_RATE = 1800;
const SLIPPAGE_TOLERANCE = '0.5%';

type TokenSymbol = 'ETH' | 'USDC';

const TOKENS: { symbol: TokenSymbol; label: string }[] = [
  { symbol: 'ETH', label: 'ETH' },
  { symbol: 'USDC', label: 'USDC' },
];

function computeOutputAmount(
  fromToken: TokenSymbol,
  toToken: TokenSymbol,
  amount: string
): string {
  const num = parseFloat(amount);
  if (Number.isNaN(num) || num <= 0) return '';
  if (fromToken === toToken) return amount;
  if (fromToken === 'ETH' && toToken === 'USDC') {
    return (num * MOCK_ETH_USDC_RATE).toLocaleString('en-US', {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0,
    });
  }
  // USDC -> ETH
  return (num / MOCK_ETH_USDC_RATE).toLocaleString('en-US', {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  });
}

function getPricePreview(fromToken: TokenSymbol, toToken: TokenSymbol): string {
  if (fromToken === toToken) return '1:1';
  if (fromToken === 'ETH' && toToken === 'USDC') {
    return `1 ETH ≈ ${MOCK_ETH_USDC_RATE} USDC`;
  }
  return `1 USDC ≈ ${(1 / MOCK_ETH_USDC_RATE).toFixed(6)} ETH`;
}

export function SwapInterface() {
  const { isConnected } = useAccount();
  const [fromToken, setFromToken] = useState<TokenSymbol>('ETH');
  const [toToken, setToToken] = useState<TokenSymbol>('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [swapStatus, setSwapStatus] = useState<'idle' | 'confirming' | 'success'>('idle');

  const outputAmount = computeOutputAmount(fromToken, toToken, fromAmount);
  const pricePreview = getPricePreview(fromToken, toToken);

  const flipTokens = useCallback(() => {
    setFromToken((prev) => toToken);
    setToToken((prev) => fromToken);
    setFromAmount((prev) => {
      const out = computeOutputAmount(fromToken, toToken, prev);
      return out || prev;
    });
  }, [fromToken, toToken]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setFromAmount(value);
    if (swapStatus !== 'idle') setSwapStatus('idle');
  };

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !fromAmount || parseFloat(fromAmount) <= 0) return;

    setSwapStatus('confirming');
    await new Promise((r) => setTimeout(r, 1500));
    setSwapStatus('success');
  };

  const inputAmount = parseFloat(fromAmount);
  const hasValidAmount = !Number.isNaN(inputAmount) && inputAmount > 0;
  const isButtonDisabled =
    !isConnected ||
    !fromAmount ||
    !hasValidAmount ||
    swapStatus === 'confirming';

  const buttonText = !isConnected
    ? 'Connect Wallet to Swap'
    : swapStatus === 'confirming'
      ? 'Confirming swap...'
      : swapStatus === 'success'
        ? 'Swap simulated successfully'
        : 'Swap Tokens';

  return (
    <div className="space-y-4">
      <form onSubmit={handleSwap} className="space-y-4">
        {/* FROM TOKEN */}
        <div className="rounded-xl bg-surface-muted border border-border p-4 space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            From
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={fromAmount}
              onChange={handleFromAmountChange}
              className="flex-1 min-w-0 bg-transparent text-white text-lg font-mono placeholder-gray-500 focus:outline-none"
              disabled={!isConnected}
            />
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value as TokenSymbol)}
              className="rounded-lg bg-surface-elevated border border-border px-3 py-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              disabled={!isConnected}
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FLIP BUTTON */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={flipTokens}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-muted border border-border text-gray-400 hover:text-accent hover:border-accent/50 transition-colors"
            aria-label="Flip swap direction"
          >
            <span className="text-xl leading-none">⇅</span>
          </button>
        </div>

        {/* TO TOKEN */}
        <div className="rounded-xl bg-surface-muted border border-border p-4 space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            To
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={outputAmount}
              readOnly
              className="flex-1 min-w-0 bg-transparent text-white text-lg font-mono placeholder-gray-500 focus:outline-none cursor-default"
              placeholder="0.0"
            />
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value as TokenSymbol)}
              className="rounded-lg bg-surface-elevated border border-border px-3 py-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              disabled={!isConnected}
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PRICE PREVIEW */}
        <p className="text-sm text-gray-400 text-center">
          {pricePreview}
        </p>

        {/* SLIPPAGE */}
        <p className="text-xs text-gray-500 text-center">
          Slippage tolerance: {SLIPPAGE_TOLERANCE}
        </p>

        {/* STATUS MESSAGE */}
        {swapStatus === 'confirming' && (
          <div className="flex items-center justify-center gap-2 text-accent text-sm">
            <div
              className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent"
              aria-hidden
            />
            <span>Confirming swap...</span>
          </div>
        )}
        {swapStatus === 'success' && (
          <p className="text-center text-sm text-accent font-medium">
            Swap simulated successfully
          </p>
        )}

        {/* SWAP BUTTON */}
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full py-3 rounded-xl font-medium bg-accent text-surface hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}
