import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { getDefaultWallets, getDefaultConfig } from "@rainbow-me/rainbowkit";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  console.warn(
    "Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID environment variable"
  );
}

const { wallets } = getDefaultWallets({
  appName: "NFT Marketplace",
  projectId,
  chains: [sepolia, mainnet],
});

// Wagmi Configuration
export const config = getDefaultConfig({
  appName: "NFT Marketplace",
  projectId,
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  wallets,
});
