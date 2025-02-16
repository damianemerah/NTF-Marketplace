const express = require("express");
const router = express.Router();
const NFT = require("../models/nft");

// Store NFT Data
router.post("/mint", async (req, res) => {
  try {
    const { name, description, imageUrl, nftId, walletAddress } = req.body;

    // Validate required fields
    if (!name || !description || !imageUrl || !nftId || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if NFT ID already exists
    const existingNFT = await NFT.findOne({ nftId });
    if (existingNFT) {
      return res.status(409).json({
        success: false,
        message: "NFT ID already exists",
      });
    }

    const nft = new NFT({
      nftId,
      name,
      description,
      imageUrl,
      walletAddress,
    });

    await nft.save();

    res.status(201).json({
      success: true,
      data: nft,
    });
  } catch (error) {
    console.error("Error minting NFT:", error);
    res.status(500).json({
      success: false,
      message: "Error creating NFT",
    });
  }
});

// Get NFT by ID
router.get("/:nftId", async (req, res) => {
  try {
    const nft = await NFT.findOne({ nftId: req.params.nftId });

    if (!nft) {
      return res.status(404).json({
        success: false,
        message: "NFT not found",
      });
    }

    res.json({
      success: true,
      data: nft,
    });
  } catch (error) {
    console.error("Error fetching NFT:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching NFT",
    });
  }
});

// Get NFT Gallery by Wallet Address
router.get("/gallery/:walletAddress", async (req, res) => {
  try {
    const nfts = await NFT.find({
      walletAddress: req.params.walletAddress,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: nfts,
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching NFT gallery",
    });
  }
});

module.exports = router;
