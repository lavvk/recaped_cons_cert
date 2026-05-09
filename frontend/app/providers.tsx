"use client";

import * as React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";

// JSON.stringify can't serialize BigInt by default, but wagmi/react-query's
// SSR dehydration path runs JSON.stringify over query data. Polyfill toJSON.
if (typeof (BigInt.prototype as any).toJSON !== "function") {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}
import { sepolia } from "wagmi/chains";
import { defineChain } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
} from "@rainbow-me/rainbowkit/wallets";

const hardhat = defineChain({
  id: 31337,
  name: "Hardhat",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
  testnet: true,
});

// --- Two-mode wallet setup --------------------------------------------------
// Local demo (no project id): only the injected wallet (MetaMask extension via
// window.ethereum). No QR, no SDK fallbacks, no fake project id.
// Full mode (real project id): MetaMask SDK, Coinbase Wallet, WalletConnect,
// Rainbow.
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Coinbase Wallet works without a WalletConnect project id (its own SDK +
// passkey/smart-wallet flow), so users without the MetaMask extension can
// still sign in. WalletConnect / MetaMask-mobile / Rainbow require a real
// project id from https://cloud.walletconnect.com.
const walletGroups = projectId
  ? [
      {
        groupName: "Recommended",
        wallets: [injectedWallet, metaMaskWallet, coinbaseWallet],
      },
      {
        groupName: "More",
        wallets: [walletConnectWallet, rainbowWallet],
      },
    ]
  : [
      {
        groupName: "Recommended",
        wallets: [injectedWallet, coinbaseWallet],
      },
    ];

const connectors = connectorsForWallets(walletGroups, {
  appName: "Recaped",
  // RainbowKit requires a string here; only the WC-based wallets ever read it,
  // and those are excluded in local mode.
  projectId: projectId ?? "",
});

const wagmiConfig = createConfig({
  connectors,
  chains: [hardhat, sepolia],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(),
  },
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#FF8FA3",
            accentColorForeground: "#1a0a10",
            borderRadius: "large",
            overlayBlur: "small",
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
