import type { Metadata } from 'next';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Web3 Token Dashboard',
  description: 'Connect wallet and interact with ERC20 tokens on Sepolia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
