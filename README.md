# NFT Marketplace

A modern NFT (Non-Fungible Token) marketplace built with Next.js, allowing users to mint and showcase their digital collectibles on the Sepolia testnet.

## Features

- 🎨 NFT Minting with metadata storage
- 👛 Wallet integration with RainbowKit
- 🖼️ NFT Gallery display
- ⛓️ Blockchain interaction using Wagmi
- 🎯 Real-time transaction notifications
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Web3 Integration**:
  - Wagmi
  - RainbowKit
  - Viem
- **State Management**: TanStack Query
- **UI Components**: Shadcn UI
- **Notifications**: React Hot Toast
- **Backend**: Express.js with MongoDB

## Links

- **Frontend Demo**: [https://ntf-marketplace-delta.vercel.app/](https://ntf-marketplace-delta.vercel.app/)
- **Backend API**: [https://nft-marketplace-backend-jyzb.onrender.com](https://nft-marketplace-backend-jyzb.onrender.com)
- **Backend Repository**: [https://github.com/damianemerah/NFT_Marketplace_Backend.git](https://github.com/damianemerah/NFT_Marketplace_Backend.git)
- **Demo Video**: [Watch on Loom](https://www.loom.com/share/8c544c5b381f4aed88e240d7fe8c84b0?sid=d537a7a0-cbdb-42d1-973a-10e20857d0db)

## API Routes

### Frontend URL Parameters

#### NFT Details View

- **Parameter**: `?id={nftId}`
- **Example**: `http://localhost:3000?id=123`
- **Description**: Displays detailed view of a specific NFT by its ID
- **Usage**: Used in NFT Gallery for direct linking to individual NFTs

### Backend API Routes

#### 1. Mint NFT

- **Endpoint**: `POST /api/nft/mint`
- **Description**: Creates a new NFT with metadata storage
- **Request Body**:
  ```json
  {
    "name": "NFT Name",
    "description": "Description of the NFT",
    "imageUrl": "URL of the NFT image",
    "nftId": "Unique NFT ID",
    "walletAddress": "User's wallet address"
  }
  ```
- **Success Response**: `201 Created`
- **Error Responses**:
  - `400`: Missing required fields
  - `409`: NFT ID already exists
  - `500`: Server error

#### 2. Get NFT Details

- **Endpoint**: `GET /api/nft/:nftId`
- **Description**: Retrieves NFT metadata by ID
- **Success Response**: `200 OK`
- **Error Responses**:
  - `404`: NFT not found
  - `500`: Server error

#### 3. Get Wallet Gallery

- **Endpoint**: `GET /api/nft/gallery/:walletAddress`
- **Description**: Retrieves all NFTs owned by a wallet address
- **Success Response**: `200 OK`
- **Error Response**: `500`: Server error

### Smart Contract Functions

#### 1. Mint NFT

- **Function**: `mint(uint256 tokenId, string metadataUrl)`
- **Description**: Mints a new NFT with the given ID and metadata URL
- **Network**: Sepolia Testnet

#### 2. Check ID

- **Function**: `checkId(uint256 tokenId)`
- **Description**: Verifies if an NFT ID already exists
- **Returns**: Boolean

## Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_API_URL=your_api_url
MONGO_URI=your_mongodb_connection_string
```

## Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Start the backend server:

```bash
npm run server
```

The application will be available at [https://ntf-marketplace-delta.vercel.app/](https://ntf-marketplace-delta.vercel.app/).

The application API will be available at [https://nft-marketplace-backend-jyzb.onrender.com](https://nft-marketplace-backend-jyzb.onrender.com).

## Project Structure

```
├── app/                  # Next.js app directory
├── components/          # React components
├── server/             # Express backend
│   ├── routes/        # API routes
│   ├── models/        # MongoDB models
│   └── index.js       # Server entry point
├── public/            # Static assets
└── contract/          # Smart contract artifacts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Wagmi](https://wagmi.sh/)
- [Shadcn UI](https://ui.shadcn.com/)
