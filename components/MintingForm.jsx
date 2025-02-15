// React and Next.js imports
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

// UI Components
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Share, Checkmark, Box } from "@/components/icons/icons";

// Web3 and Contract imports
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { contractABI, contractAddress } from "../contract";

// Config and Query
import { config } from "@/config";
import { useQueryClient } from "@tanstack/react-query";

export function MintingForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [nftId, setNftId] = useState(null);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintedNFT, setMintedNFT] = useState(null);
  const { address } = useAccount();
  const queryClient = useQueryClient();

  // Contract read function to check if ID exists
  const { data: idExists, refetch: checkId } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "checkId",
    args: [nftId],
    enabled: false,
  });

  // Contract write function to mint NFT
  const { writeContractAsync } = useWriteContract();

  const generateUniqueId = async () => {
    let isUnique = false;
    let newId;

    while (!isUnique) {
      newId = Math.floor(Math.random() * 1000000);
      const { data } = await checkId({ args: [newId] });
      if (!data) {
        isUnique = true;
        setNftId(newId);
      }
    }
    return newId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address) return toast.error("Please connect your wallet first");

    try {
      setIsLoading(true);
      // 1. Generate unique ID
      const uniqueId = await generateUniqueId();
      const data = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        nftId: uniqueId,
        walletAddress: address,
      };

      // 2. Store metadata in backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nft/mint`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to store NFT metadata");

      // 3. Mint NFT with metadata URL
      const metadataUrl = `${window.location.origin}/api/nft/${uniqueId}`;

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "mint",
        args: [uniqueId, metadataUrl],
      });

      // Wait for transaction to be mined
      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt.status === "success") {
        setMintedNFT({
          name: formData.name,
          description: formData.description,
          imageUrl: formData.imageUrl,
          id: uniqueId,
        });
        setMintSuccess(true);
        toast.success("NFT minted successfully!");

        // Invalidate and refetch NFTs query
        await queryClient.invalidateQueries({
          queryKey: ["nfts", address],
        });
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Error minting NFT. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (mintSuccess && mintedNFT) {
    return (
      <Card className="p-[33px] text-left max-w-[576px] mx-auto bg-[#111827]/50 border border-[#10B981] backdrop-blur-lg">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center items-center mb-6 mx-auto rounded-full bg-[#10B981]/20 w-20 h-20">
            <Checkmark className="w-8 h-8 text-[#10B981]" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-[#10B981]">
            NFT Minted Successfully!
          </h2>
          <p className="text-[#9CA3AF] mb-8">
            Your NFT has been created and added to your collection
          </p>

          <div className="rounded-xl overflow-hidden mb-8 ">
            <Image
              src={mintedNFT?.imageUrl}
              alt={mintedNFT?.name}
              width={462}
              height={256}
              className="w-full h-56 object-cover"
            />
          </div>
          <div className="text-left mb-6">
            <div className="mb-2">
              <p className="text-sm text-[#9CA3AF]">NFT Name</p>
              <h3 className="font-semibold text-[#D1D5DB]">
                {mintedNFT?.name}
              </h3>
            </div>
            <div className="mb-2">
              <p className="text-sm text-[#9CA3AF]">Description</p>
              <p className="text-[#D1D5DB]">{mintedNFT?.description}</p>
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF]">NFT ID</p>
              <p className="text-[#8B5CF6]">{mintedNFT?.id}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <div className="grid grid-cols-2 gap-4 w-full bg-[#1F2937]">
            <Button
              onClick={() => {
                toast.info("Share functionality coming soon!");
              }}
              variant="outline"
              className="w-full bg-[#1F2937] border-[#E5E7EB] text-white"
            >
              <Share className="w-4 h-4" />
              Share
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:opacity-90"
              onClick={() => window.location.reload()}
            >
              <Box className="w-4 h-4" />
              Mint Another
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="p-[33px] text-left max-w-[576px] mx-auto bg-[#111827]/50 border border-[#1F2937] backdrop-blur">
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">
            Mint Your NFT
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#9ca3af] block mb-2">
                NFT Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter NFT name"
                className="text-white bg-[#1f2937] border-0"
                required
              />
            </div>
            <div>
              <label className="text-sm text-[#9ca3af] block mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your NFT"
                className="text-white bg-[#1f2937] border-0 min-h-[100px]"
                required
              />
            </div>
            <div>
              <label className="text-sm text-[#9ca3af] block mb-2">
                Image URL
              </label>
              <Input
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="Enter image URL"
                className="text-white bg-[#1f2937] border-0"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:opacity-90 py-5"
          >
            {isLoading ? "Minting..." : "Mint NFT"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
