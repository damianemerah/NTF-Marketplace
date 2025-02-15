import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  console.warn(
    "Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID environment variable"
  );
}

// Wagmi Configuration
export const config = getDefaultConfig({
  appName: "NFT Marketplace",
  projectId: projectId,
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});
