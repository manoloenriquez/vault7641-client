# Guild Selection Setup Guide

This guide will help you set up the guild selection feature for Vault 7641 on Solana.

## Prerequisites

- Node.js 20.18.0 or higher
- A Solana wallet with update authority over your NFT collection
- Metadata and images hosted on a public server

## Installation

1. **Install Dependencies**

```bash
npm install
```

This will install all required packages including:

- `@solana/web3.js` - Solana blockchain interaction
- `@solana/wallet-adapter-react` - Wallet integration
- `@solana/spl-token` - Token operations
- `@metaplex-foundation/mpl-token-metadata` - NFT metadata updates
- `@metaplex-foundation/umi` - Metaplex framework

2. **Configure Environment Variables**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

```bash
# Solana RPC endpoint
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Update authority private key (keep this secret!)
NFT_UPDATE_AUTHORITY_PRIVATE_KEY=[123,45,67,...]

# Metadata base URL
NEXT_PUBLIC_METADATA_BASE_URL=https://vault7641.com
```

### Getting Your Update Authority Private Key

The update authority private key should be exported from your wallet as a JSON array:

```bash
# Using Solana CLI
solana-keygen export ~/.config/solana/update-authority.json

# The output will be a JSON array like:
# [123,45,67,89,...]
```

**⚠️ SECURITY WARNING**: Never commit this private key to version control!

## Metadata Structure

Organize your metadata and images as follows:

```
/public/art/
  ├── pass.png                    # Base pass image (before guild selection)
  ├── 1.json                      # Base pass metadata for token #1
  ├── 2.json                      # Base pass metadata for token #2
  ├── ...
  ├── builder/
  │   ├── 1.json                  # Builder guild metadata for token #1
  │   ├── 1.png                   # Builder guild image for token #1
  │   ├── 2.json
  │   ├── 2.png
  │   └── ...
  ├── trader/
  │   ├── 1.json
  │   ├── 1.png
  │   └── ...
  ├── farmer/
  │   ├── 1.json
  │   ├── 1.png
  │   └── ...
  ├── gamer/
  │   ├── 1.json
  │   ├── 1.png
  │   └── ...
  └── pathfinder/
      ├── 1.json
      ├── 1.png
      └── ...
```

### Base Pass Metadata Example

`/public/art/1.json`:

```json
{
  "name": "Vault 7641 Base Pass #1",
  "symbol": "V7641",
  "description": "Vault 7641 Base Pass - Select your guild to begin your journey.",
  "image": "https://vault7641.com/art/pass.png",
  "attributes": [
    {
      "trait_type": "Type",
      "value": "Base Pass"
    },
    {
      "trait_type": "Status",
      "value": "Unrevealed"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://vault7641.com/art/pass.png",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

### Guild-Specific Metadata Example

`/public/art/builder/1.json`:

```json
{
  "name": "Vault 7641 Builder #1",
  "symbol": "V7641",
  "description": "Vault 7641 Builder Guild Member - For engineers, designers, and creators.",
  "image": "https://vault7641.com/art/builder/1.png",
  "attributes": [
    {
      "trait_type": "Guild",
      "value": "Builder"
    },
    {
      "trait_type": "Token Number",
      "value": 1
    },
    {
      "trait_type": "Status",
      "value": "Revealed"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://vault7641.com/art/builder/1.png",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

## Development

1. **Start Development Server**

```bash
npm run dev
```

The app will be available at http://localhost:3000

2. **Test Guild Selection**

- Connect your Solana wallet (Phantom, Solflare, etc.)
- Navigate to the guild selection page
- Select a guild for your NFT
- Sign the transaction in your wallet
- The NFT metadata will be updated on-chain

## Testing on Devnet

For testing, use Solana devnet:

1. Update `.env.local`:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

2. Use a devnet wallet and NFT collection

3. Ensure your update authority wallet has SOL for transaction fees:

```bash
solana airdrop 2 YOUR_WALLET_ADDRESS --url devnet
```

## Deployment

### Vercel Deployment

1. **Push to GitHub**

```bash
git add .
git commit -m "Add guild selection feature"
git push origin main
```

2. **Deploy to Vercel**

- Connect your repository to Vercel
- Add environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SOLANA_RPC_URL`
  - `NFT_UPDATE_AUTHORITY_PRIVATE_KEY`
  - `NEXT_PUBLIC_METADATA_BASE_URL`

3. **Deploy**

```bash
vercel --prod
```

### Environment Variable Security

For production:

1. Use Vercel's environment variable encryption
2. Consider using a multisig wallet for update authority
3. Set up monitoring and alerts
4. Regularly rotate keys if possible

## API Endpoints

### POST /api/guild/assign

Updates NFT metadata with guild-specific URI.

**Request:**

```bash
curl -X POST https://yourdomain.com/api/guild/assign \
  -H "Content-Type: application/json" \
  -d '{
    "nftMint": "mint_address",
    "tokenNumber": 1,
    "guildId": "builder",
    "walletAddress": "wallet_address",
    "transactionSignature": "signature"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "nftMint": "mint_address",
    "tokenNumber": 1,
    "guildId": "builder",
    "newUri": "https://vault7641.com/art/builder/1.json",
    "transactionSignature": "signature"
  }
}
```

## Troubleshooting

### "Cannot find module '@solana/web3.js'"

Run `npm install` to install dependencies.

### "NFT_UPDATE_AUTHORITY_PRIVATE_KEY is not set"

Make sure you've set the environment variable in `.env.local`.

### "Wallet does not own this NFT"

The connected wallet doesn't own the NFT being updated. Verify ownership.

### "Transaction failed"

- Check that the update authority wallet has SOL for transaction fees
- Verify the update authority has permission to update the NFT
- Check RPC endpoint is responding

### Metadata not updating

- Verify metadata JSON files are publicly accessible
- Check CORS settings on your server
- Ensure URIs are correctly formatted

## Monitoring

Monitor these metrics:

- Guild assignment success rate
- Failed transactions
- API response times
- Guild distribution

## Support

For issues:

1. Check the console for errors
2. Review the logs in `/api/guild/assign/route.ts`
3. Verify environment variables are set correctly
4. Test on devnet first before mainnet

## Additional Resources

- [Metaplex Token Metadata Docs](https://developers.metaplex.com/token-metadata)
- [Solana Web3.js Guide](https://solana-labs.github.io/solana-web3.js/)
- [Wallet Adapter Docs](https://github.com/solana-labs/wallet-adapter)
- [Backend Guild Flow Documentation](./BACKEND_GUILD_FLOW.md)
