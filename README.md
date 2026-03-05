# Web3 Token Dashboard

A minimal, production-ready DApp that connects a user's wallet and interacts with an ERC20 token contract on the **Sepolia** testnet. Built with Next.js 14, TypeScript, Tailwind CSS, wagmi, viem, and RainbowKit.

## Features

- **Wallet connection** — Connect via MetaMask and WalletConnect (RainbowKit); display connected address
- **Token balance** — Read and display formatted ERC20 balance from the configured contract
- **Transfer tokens** — Recipient address and amount inputs; send transaction with pending/success feedback
- **Transaction feedback** — Transaction hash, loading states, and Etherscan link
- **UI** — Centered card layout, mobile responsive, dark theme with accent styling

## Tech Stack

| Layer      | Technology   |
|-----------|--------------|
| Framework | Next.js 14 (App Router) |
| Language  | TypeScript   |
| Styling   | Tailwind CSS |
| Web3      | wagmi, viem  |
| Wallets   | RainbowKit   |
| Network   | Sepolia      |

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main dashboard page
│   ├── providers.tsx   # Wagmi + RainbowKit + React Query providers
│   └── globals.css     # Global styles
├── components/
│   ├── WalletConnect.tsx  # RainbowKit connect + address display
│   ├── TokenBalance.tsx   # ERC20 balance read
│   └── TransferForm.tsx   # Transfer form + tx feedback
├── lib/
│   ├── wagmiConfig.ts  # RainbowKit/wagmi config (Sepolia)
│   └── contract.ts     # Token address + ERC20 ABI
├── .env.example
└── README.md
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com). Required for WalletConnect. |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | ERC20 token contract address on Sepolia. Use a deployed token or a placeholder for UI testing. |

Example:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
```

### 3. Run the project

**Development:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Connect a wallet on Sepolia and ensure you have testnet ETH and the token you’re reading/transferring.

**Production build:**

```bash
npm run build
npm start
```

### 4. Deploy to Vercel

1. Push the repo to GitHub (or another Git provider supported by Vercel).
2. In [Vercel](https://vercel.com), **Add New Project** and import the repo.
3. Set **Environment Variables** in the project settings:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_TOKEN_ADDRESS`
4. Deploy. Vercel will use the build command `next build` and output directory from the framework preset.

**CLI deploy (optional):**

```bash
npm i -g vercel
vercel
```

Follow the prompts and add the same env vars when asked or in the Vercel dashboard.

## Contract interaction

The app uses a minimal ERC20 ABI with:

- `balanceOf(address)` — read balance
- `transfer(address, uint256)` — send tokens
- `decimals()` and `symbol()` — for display

The token address is read from `NEXT_PUBLIC_TOKEN_ADDRESS`. Use a real Sepolia ERC20 address for live use, or leave a placeholder to run the UI and see connect/balance/transfer UX.

## Extending the app

The structure is set up so you can:

- Add more chains in `lib/wagmiConfig.ts`
- Add more contract reads/writes in `lib/contract.ts` and new components
- Reuse `WalletConnect`, `TokenBalance`, and `TransferForm` in other pages
- Add swap, stake, or other DeFi flows using the same wagmi/viem patterns

## License

MIT
