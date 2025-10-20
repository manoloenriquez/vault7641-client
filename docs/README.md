# Guild Selection System - Complete Documentation

Welcome to the Vault 7641 Guild Selection System documentation. This system allows NFT holders to select and assign guilds to their Base Pass NFTs on the Solana blockchain.

## 📚 Documentation Index

### Quick Start

- **[Setup Guide](./SETUP_GUIDE.md)** - Complete setup instructions from installation to deployment
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Overview of what was built and how it works

### Technical Documentation

- **[Backend Guild Flow](./BACKEND_GUILD_FLOW.md)** - Detailed backend architecture and API specifications
- **[Metadata Templates](./METADATA_TEMPLATES.md)** - JSON templates and batch generation scripts

## 🎯 What is the Guild Selection System?

The Guild Selection System allows Vault 7641 Base Pass NFT holders to:

1. **Connect their Solana wallet** (Phantom, Solflare, etc.)
2. **View their Base Pass NFTs** (unrevealed state)
3. **Select one of 5 guilds**:
   - 🔨 **Builder** - For developers, designers, and creators
   - 📈 **Trader** - For traders and investors
   - 🌾 **Farmer** - For DeFi participants and airdrop hunters
   - 🎮 **Gamer** - For P2E gamers and NFT collectors
   - 🧭 **Pathfinder** - For career seekers and professionals
4. **Update their NFT metadata on-chain** - The NFT transforms to show guild-specific art
5. **Access guild-specific benefits** in the Vault 7641 ecosystem

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Frontend      │  React + Next.js + Solana Wallet Adapter
│   (Next.js)     │  - Guild selection UI
│                 │  - Wallet connection
└────────┬────────┘  - Transaction signing
         │
         ├─────────────────────────────────────┐
         │                                     │
         ▼                                     ▼
┌─────────────────┐                  ┌──────────────────┐
│   Backend API   │                  │   Solana         │
│   (/api/guild)  │                  │   Blockchain     │
│                 │                  │                  │
│  - Metaplex SDK │◄─────────────────┤  - NFT Metadata  │
│  - Update Auth  │  Update Metadata │  - Token Program │
└─────────────────┘                  └──────────────────┘
         │
         ▼
┌─────────────────┐
│   Metadata      │  JSON files hosted on CDN/IPFS
│   Storage       │  - Base pass metadata
│                 │  - Guild-specific metadata
└─────────────────┘  - Guild images
```

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo>
cd vault7641-client

# Install dependencies
npm install
```

### 2. Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
```

Required environment variables:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NFT_UPDATE_AUTHORITY_PRIVATE_KEY=[123,45,67,...]
NEXT_PUBLIC_METADATA_BASE_URL=https://vault7641.com
```

### 3. Prepare Metadata

Create metadata structure:

```
/public/art/
  ├── pass.png              # Base pass image
  ├── 1.json - 7641.json    # Base pass metadata
  ├── builder/
  │   ├── 1.json - 7641.json
  │   └── 1.png - 7641.png
  ├── trader/
  ├── farmer/
  ├── gamer/
  └── pathfinder/
```

See [Metadata Templates](./METADATA_TEMPLATES.md) for JSON format and generation scripts.

### 4. Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### 5. Testing

Test on Solana devnet first:

```bash
# Update .env.local
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Get devnet SOL
solana airdrop 2 YOUR_WALLET_ADDRESS --url devnet
```

### 6. Deployment

```bash
# Deploy to Vercel
vercel --prod

# Or build for production
npm run build
npm start
```

## 📁 Project Structure

```
vault7641-client/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── guild/
│   │   │       └── assign/
│   │   │           └── route.ts          # API endpoint for guild assignment
│   │   ├── layout.tsx                    # App layout with Solana provider
│   │   └── page.tsx                      # Homepage
│   ├── components/
│   │   ├── solana/
│   │   │   └── solana-provider.tsx       # Solana wallet provider
│   │   ├── vault/
│   │   │   ├── guild-selection-feature.tsx  # Guild selection UI
│   │   │   └── guild-selection-modal.tsx    # Guild selection modal
│   │   └── auth/
│   │       └── auth-guard.tsx            # Auth & NFT ownership guard
│   ├── hooks/
│   │   └── use-guild-selection.tsx       # Guild selection logic
│   └── lib/
│       └── solana/
│           ├── nft-operations.ts         # NFT utility functions
│           └── vault-nft-program.ts      # Solana program config
├── public/
│   └── art/                              # Metadata and images
│       ├── pass.png
│       ├── *.json
│       └── [guild]/
│           ├── *.json
│           └── *.png
├── docs/
│   ├── README.md                         # This file
│   ├── SETUP_GUIDE.md                    # Detailed setup
│   ├── BACKEND_GUILD_FLOW.md             # Backend documentation
│   ├── METADATA_TEMPLATES.md             # Metadata templates
│   └── IMPLEMENTATION_SUMMARY.md         # Implementation overview
└── .env.example                          # Environment template
```

## 🔑 Key Files

### Backend

- `src/app/api/guild/assign/route.ts` - Guild assignment API endpoint using Metaplex SDK

### Frontend

- `src/hooks/use-guild-selection.tsx` - Guild selection hook with transaction logic
- `src/components/vault/guild-selection-feature.tsx` - Main guild selection UI
- `src/components/solana/solana-provider.tsx` - Wallet adapter configuration

### Library

- `src/lib/solana/nft-operations.ts` - NFT fetching and metadata operations
- `src/lib/solana/vault-nft-program.ts` - Solana program configuration

## 🔐 Security Best Practices

1. **Never commit private keys** to version control
2. **Use environment variables** for all sensitive data
3. **Validate NFT ownership** before updates
4. **Rate limit API endpoints** to prevent abuse
5. **Monitor transactions** for unusual activity
6. **Use multisig wallets** for production update authority
7. **Test on devnet first** before mainnet deployment

## 📖 API Reference

### POST /api/guild/assign

Assigns a guild to a Base Pass NFT.

**Request:**

```json
{
  "nftMint": "mint_address",
  "tokenNumber": 1234,
  "guildId": "builder",
  "walletAddress": "wallet_address",
  "transactionSignature": "signature"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "nftMint": "mint_address",
    "tokenNumber": 1234,
    "guildId": "builder",
    "newUri": "https://vault7641.com/art/builder/1234.json",
    "transactionSignature": "signature"
  }
}
```

See [Backend Guild Flow](./BACKEND_GUILD_FLOW.md) for complete API documentation.

## 🐛 Troubleshooting

### Common Issues

**"Cannot find module '@solana/web3.js'"**

- Run `npm install` to install dependencies

**"NFT_UPDATE_AUTHORITY_PRIVATE_KEY is not set"**

- Set the environment variable in `.env.local`

**"Transaction failed"**

- Check update authority wallet has SOL for fees
- Verify update authority has permission
- Test on devnet first

**Metadata not updating**

- Verify JSON files are publicly accessible
- Check CORS settings
- Ensure URIs are correct

See [Setup Guide](./SETUP_GUIDE.md) for more troubleshooting steps.

## 📊 Monitoring

Track these metrics:

- Guild assignment success rate
- Failed transactions
- API response times
- Guild distribution statistics
- Active wallet addresses

## 🔄 Workflow

### User Journey

1. User connects Solana wallet
2. Views their Base Pass NFTs
3. Clicks "Select Guild"
4. Chooses guild from modal
5. Signs transaction in wallet
6. Backend updates metadata on-chain
7. NFT displays guild-specific art
8. User accesses guild benefits

### Technical Flow

1. Frontend: `getUserNFTs()` fetches NFTs
2. User selects guild
3. Frontend: `updateNftGuild()` creates transaction
4. User signs with wallet
5. Backend: API updates metadata via Metaplex
6. Blockchain: Metadata updated on-chain
7. Frontend: Displays success message
8. NFT: Shows new guild-specific image

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Blockchain**: Solana, Metaplex Token Metadata
- **Wallet**: Solana Wallet Adapter (Phantom, Solflare, etc.)
- **Styling**: Tailwind CSS
- **API**: Next.js API Routes
- **SDK**: Metaplex Umi, @solana/web3.js

## 📦 Dependencies

Key packages:

- `@solana/web3.js` - Solana blockchain interaction
- `@solana/wallet-adapter-react` - Wallet integration
- `@metaplex-foundation/mpl-token-metadata` - NFT metadata
- `@metaplex-foundation/umi` - Metaplex framework
- `@solana/spl-token` - Token operations

## 🎨 Guild Art Assets

Each guild needs:

- 7,641 unique images (1 per token)
- 7,641 metadata JSON files
- Consistent naming: `[tokenNumber].json` and `[tokenNumber].png`
- Hosted on CDN or IPFS
- Publicly accessible

See [Metadata Templates](./METADATA_TEMPLATES.md) for generation scripts.

## 🚢 Deployment Checklist

- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Generate all metadata files (7,641 × 6 = 45,846 files)
- [ ] Upload metadata and images to CDN/IPFS
- [ ] Test on devnet
- [ ] Deploy to Vercel
- [ ] Set production environment variables
- [ ] Test on mainnet with small batch
- [ ] Monitor for issues
- [ ] Launch to community

## 📚 Additional Resources

### Documentation

- [Metaplex Token Metadata](https://developers.metaplex.com/token-metadata)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Umi Framework](https://developers.metaplex.com/umi)

### Tools

- [Solana Explorer](https://explorer.solana.com/)
- [Metaplex Studio](https://studio.metaplex.com/)
- [Solana CLI](https://docs.solana.com/cli)

## 💬 Support

Need help? Check:

1. Console logs for errors
2. API endpoint logs in `/api/guild/assign/route.ts`
3. Solana explorer for transaction details
4. Environment variables are set correctly
5. Test on devnet before mainnet

## 📝 License

[Your License Here]

## 👥 Contributors

[Your Team Here]

---

**Built with ❤️ for the Vault 7641 Community**

Last Updated: October 2025
