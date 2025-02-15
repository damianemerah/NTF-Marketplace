"use client";

// UI Components
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Custom Components
import { MintingForm } from "@/components/MintingForm.jsx";
import NFTGallery from "@/components/NFTGallery.jsx";

// Icons
import { Box, Play, Wallet, Rocket } from "@/components/icons/icons";

export default function NFTMarketplace() {
  return (
    <div className="min-h-screen bg-[#111827] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-20 py-4 bg-black/80 border border-[#1F2937]">
        <Box className="w-8 h-8 text-[#8b5cf6]" />
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        onClick={openConnectModal}
                        className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-full flex items-center gap-2 px-6"
                      >
                        <Wallet className="w-5 h-5" />
                        Connect Wallet
                      </Button>
                    );
                  }

                  return (
                    <div className="flex gap-3">
                      <Button
                        onClick={openChainModal}
                        className="bg-[#1F2937] hover:bg-opacity-75 rounded-full"
                      >
                        {chain.name}
                      </Button>
                      <Button
                        onClick={openAccountModal}
                        className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-full"
                      >
                        {account.displayName}
                      </Button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-6xl font-bold mb-8 ">
          Discover & Collect
          <br />
          Extraordinary NFTs
        </h1>
        <p className="text-[#D1D5DB] max-w-2xl mx-auto mb-8">
          Enter the world of digital art and collectibles. Explore unique NFTs
          created by artists worldwide.
        </p>
        <div className="flex gap-4 justify-center mb-24">
          <Button className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:bg-opacity-75">
            <Rocket className="w-4 h-4" />
            Start Creating
          </Button>
          <Button className="hover:bg-opacity-75 border border-[#374151] bg-[#1F2937]/50">
            <Play className="w-4 h-4" />
            Watch Demo
          </Button>
        </div>

        <MintingForm />
        <NFTGallery />
      </main>
    </div>
  );
}
