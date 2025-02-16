// React and hooks
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const nftId = searchParams.get("id");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Query for single NFT
  const {
    data: singleNft,
    isLoading: isLoadingSingle,
    isError: isErrorSingle,
    error: errorSingle,
  } = useQuery({
    queryKey: ["nft", nftId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/nft/${nftId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch NFT: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.success) {
          throw new Error("API response was not successful");
        }
        return data.data;
      } catch (error) {
        toast.error(`Error fetching NFT: ${error.message}`);
        throw error;
      }
    },
    enabled: !!nftId && mounted,
  });

  // Query for NFT gallery
  const {
    data: nfts,
    isLoading: isLoadingGallery,
    isError: isErrorGallery,
    error: errorGallery,
  } = useQuery({
    queryKey: ["nfts", address],
    queryFn: async () => {
      if (!address) return [];
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        console.log("API URL:🎈🎈", apiUrl); // Debug log

        const response = await fetch(`${apiUrl}/api/nft/gallery/${address}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.success) {
          console.error("API Error:", data);
          throw new Error("API response was not successful");
        }
        return data.data;
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(`Error fetching NFTs: ${error.message}`);
        throw error;
      }
    },
    enabled: !!address && mounted && !nftId,
  });

  // Don't render anything until mounted
  if (!mounted) return null;

  // Single NFT view
  if (nftId) {
    if (isLoadingSingle) {
      return (
        <section className="mt-24">
          <h2 className="text-2xl font-semibold mb-8 text-left">
            Loading NFT...
          </h2>
        </section>
      );
    }

    if (isErrorSingle) {
      return (
        <section className="mt-24">
          <h2 className="text-2xl font-semibold mb-8 text-left">
            Error loading NFT: {errorSingle.message}
          </h2>
        </section>
      );
    }

    if (!singleNft) {
      return (
        <section className="mt-24">
          <h2 className="text-2xl font-semibold mb-8 text-left">
            NFT not found
          </h2>
        </section>
      );
    }

    return (
      <section className="mt-24">
        <h2 className="text-2xl font-semibold mb-8 text-left">NFT Details</h2>
        <div className="max-w-xl mx-auto">
          <Card className="bg-[#1f2937]/50 border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="h-96 relative">
                <Image
                  src={singleNft.imageUrl}
                  alt={singleNft.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 text-left">
                <h3 className="text-2xl font-semibold mb-2 text-white">
                  {singleNft.name}
                </h3>
                <p className="text-[#9ca3af] mb-4">{singleNft.description}</p>
                <div className="text-sm text-[#9ca3af]">
                  <p>NFT ID: {singleNft.nftId}</p>
                  <p>Owner: {singleNft.walletAddress}</p>
                  <p>
                    Created:{" "}
                    {new Date(singleNft.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Gallery view
  if (isLoadingGallery) {
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

  if (isErrorGallery) {
    return (
      <section className="mt-24">
        <h2 className="text-2xl font-semibold mb-8 text-left">
          Error loading NFTs: {errorGallery.message}
        </h2>
      </section>
    );
  }

  if (!nfts?.length) {
    return (
      <section className="mt-24">
        <h2 className="text-2xl font-semibold mb-8 text-left">
          No NFTs found in your collection
        </h2>
      </section>
    );
  }

  return (
    <section className="mt-24">
      <h2 className="text-2xl font-semibold mb-8 text-left">Your NFTs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <Card
            key={nft.nftId}
            className="bg-[#1f2937]/50 border-0 overflow-hidden"
          >
            <CardContent className="p-0">
              <div className="h-64 relative">
                <Image
                  src={nft.imageUrl}
                  alt={nft.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {nft.name}
                </h3>
                <p className="text-[#9ca3af] text-sm mb-2 line-clamp-2">
                  {nft.description}
                </p>
                <p className="text-sm text-[#9ca3af]">ID: {nft.nftId}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
