# Web3 Token Dashboard

A minimal **Web3 dashboard DApp** that connects a user's wallet and interacts with an ERC20 token on the **Sepolia testnet**. Built using **Next.js, TypeScript, Tailwind CSS, wagmi, viem, and RainbowKit**.

Live Demo  
https://web3-token-dashboard.netlify.app/

---

## Features

- Connect wallet using **MetaMask or WalletConnect**
- Display connected wallet address
- Read **ERC20 token balance** from the blockchain
- Transfer tokens with transaction feedback
- View transaction hash with **Etherscan link**
- Simulated **ETH → USDC swap interface**
- Responsive **dark-themed UI**

---

## Tech Stack

| Layer | Technology |
|------|-------------|
| Framework | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Web3 | wagmi, viem |
| Wallet Integration | RainbowKit |
| Network | Ethereum Sepolia |
| Deployment | Netlify |

---

## Project Structure

```
app/
 ├── layout.tsx
 ├── page.tsx
 ├── providers.tsx
 └── globals.css

components/
 ├── WalletConnect.tsx
 ├── TokenBalance.tsx
 ├── TransferForm.tsx
 └── SwapInterface.tsx

lib/
 ├── wagmiConfig.ts
 └── contract.ts
```

---

## Running Locally

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Environment Variables

Create a `.env` file and add:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_TOKEN_ADDRESS=erc20_token_address
```

---

## Smart Contract Interaction

The dashboard interacts with an ERC20 contract using:

- `balanceOf(address)`
- `transfer(address,uint256)`
- `decimals()`
- `symbol()`

The contract address is configured using:

```
NEXT_PUBLIC_TOKEN_ADDRESS
```

---

## License

MIT
