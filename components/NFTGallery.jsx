// React and hooks
import { useState, useEffect } from "react";

// External libraries
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Next.js
import Image from "next/image";

// UI Components
import { Card, CardContent } from "@/components/ui/card";

export default function NFTGallery() {
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: nfts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["nfts", address],
    queryFn: async () => {
      if (!address) return [];
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/nft/gallery/${address}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.success) {
          throw new Error("API response was not successful");
        }
        return data.data;
      } catch (error) {
        toast.error(`Error fetching NFTs: ${error.message}`);
        throw error;
      }
    },
    enabled: !!address && mounted,
  });

  // Don't render anything until mounted
  if (!mounted) return null;

  if (isLoading) {
    return (
      <section className="mt-24">
        <h2 className="text-2xl font-semibold mb-8 text-left">
          Loading your NFTs...
        </h2>
      </section>
    );
  }

  if (!address) {
    return (
      <section className="mt-24">
        <h2 className="text-2xl font-semibold mb-8 text-left">
          Connect your wallet to view your NFTs
        </h2>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mt-24">
        <h2 className="text-2xl font-semibold mb-8 text-left">
          Error loading NFTs: {error.message}
        </h2>
      </section>
    );
  }

  return (
    <section className="mt-24">
      <h2 className="text-2xl font-semibold mb-8 text-left">
        Your NFT Gallery
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {nfts?.map((nft) => (
          <Card
            key={nft.nftId}
            className="bg-[#1f2937]/50 border-0 overflow-hidden hover:scale-[1.02] transition-transform"
          >
            <CardContent className="p-0">
              <div className="h-48 relative">
                <Image
                  src={nft.imageUrl}
                  alt={nft.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="font-semibold mb-1 text-white">{nft.name}</h3>
                <p className="text-sm text-[#9ca3af]">{nft.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
