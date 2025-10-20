# Backend Guild Selection Flow

## Overview

This document describes the backend flow for assigning guilds to Vault 7641 Base Pass NFTs on Solana.

## Art Asset Structure

### Base Pass (Before Guild Selection)

- **Image**: `/art/pass.png`
- **Metadata**: `/art/[tokenNumber].json`

### Guild-Specific Assets (After Guild Selection)

- **Image**: `/art/[guild-name]/[tokenNumber].png`
- **Metadata**: `/art/[guild-name]/[tokenNumber].json`

**Available Guilds:**

- `builder` - For developers, designers, and creators
- `trader` - For traders and investors
- `farmer` - For DeFi participants and airdrop hunters
- `gamer` - For P2E gamers and NFT collectors
- `pathfinder` - For career seekers and professionals

## Metadata Update Flow

### 1. User Selection (Frontend)

```typescript
// User selects guild in UI
const result = await selectGuild(nftMint, guildId, tokenNumber)
```

### 2. On-Chain Transaction (Frontend)

```typescript
// Frontend creates and sends transaction to update metadata
const { transaction, newMetadataUri } = await updateNftGuild(connection, publicKey, nftMint, guildId, tokenNumber)
const signature = await sendTransaction(transaction, connection)
```

### 3. Backend Recording (API)

```typescript
// POST /api/guild/assign
{
  "nftMint": "mint_address",
  "tokenNumber": 1234,
  "guildId": "builder",
  "walletAddress": "wallet_address",
  "transactionSignature": "signature"
}
```

## API Endpoints

### POST /api/guild/assign

Assigns a guild to a Base Pass NFT by updating its metadata on-chain using Metaplex.

**Request Body:**

```json
{
  "nftMint": "string", // NFT mint address
  "tokenNumber": 1234, // Token number (1-7641)
  "guildId": "builder", // Guild ID
  "walletAddress": "string", // Owner's wallet address
  "transactionSignature": "string" // Transaction signature from frontend
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

**Error Responses:**

- `400` - Invalid request (missing fields, invalid guild ID)
- `404` - NFT mint not found
- `500` - Server error (configuration issue, update failed)

### GET /api/guild/assign?walletAddress=xxx

Retrieves guild assignments for a wallet address.

**Query Parameters:**

- `walletAddress` - The wallet address to query

**Response:**

```json
{
  "success": true,
  "data": {
    "walletAddress": "wallet_address",
    "assignments": [
      {
        "nftMint": "mint_address",
        "tokenNumber": 1234,
        "guildId": "builder",
        "assignedAt": "2025-10-18T00:00:00Z",
        "transactionSignature": "signature"
      }
    ]
  }
}
```

## Environment Variables

### Required

```bash
# Solana RPC endpoint
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Update authority private key (JSON array format)
# This wallet must have update authority over the NFT collection
NFT_UPDATE_AUTHORITY_PRIVATE_KEY=[123,45,67,...]

# Base URL for metadata hosting
NEXT_PUBLIC_METADATA_BASE_URL=https://vault7641.com
```

### Optional

```bash
# Database connection for tracking (future feature)
DATABASE_URL=postgresql://user:password@localhost:5432/vault7641
```

## Metaplex Integration

The backend uses Metaplex's `mpl-token-metadata` program to update NFT metadata:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { updateV1, fetchMetadata } from '@metaplex-foundation/mpl-token-metadata'

// Initialize Umi
const umi = createUmi(rpcUrl)

// Fetch current metadata
const metadata = await fetchMetadata(umi, mint)

// Update with new URI
await updateV1(umi, {
  mint,
  authority: updateAuthoritySigner,
  data: {
    ...metadata,
    uri: newUri, // New guild-specific metadata URI
  },
}).sendAndConfirm(umi)
```

## Metadata JSON Format

### Base Pass Metadata (`/art/[tokenNumber].json`)

```json
{
  "name": "Vault 7641 Base Pass #1234",
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

### Guild-Specific Metadata (`/art/[guild-name]/[tokenNumber].json`)

```json
{
  "name": "Vault 7641 Builder #1234",
  "symbol": "V7641",
  "description": "Vault 7641 Builder Guild Member - For engineers, designers, and creators.",
  "image": "https://vault7641.com/art/builder/1234.png",
  "attributes": [
    {
      "trait_type": "Guild",
      "value": "Builder"
    },
    {
      "trait_type": "Token Number",
      "value": 1234
    },
    {
      "trait_type": "Status",
      "value": "Revealed"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://vault7641.com/art/builder/1234.png",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

## Security Considerations

1. **Update Authority Private Key**
   - Store securely in environment variables
   - Never commit to version control
   - Use a dedicated update authority wallet
   - Consider using a multisig for production

2. **Validation**
   - Verify NFT ownership before updates
   - Validate guild IDs against whitelist
   - Check transaction signatures
   - Rate limit API endpoints

3. **Error Handling**
   - Log all errors for monitoring
   - Return user-friendly error messages
   - Don't expose sensitive server details

## Database Schema (Optional)

For tracking guild assignments:

```sql
CREATE TABLE guild_assignments (
  id SERIAL PRIMARY KEY,
  nft_mint VARCHAR(44) NOT NULL,
  token_number INTEGER NOT NULL,
  guild_id VARCHAR(20) NOT NULL,
  wallet_address VARCHAR(44) NOT NULL,
  transaction_signature VARCHAR(88) NOT NULL,
  assigned_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(nft_mint) -- One guild per NFT
);

CREATE INDEX idx_wallet_address ON guild_assignments(wallet_address);
CREATE INDEX idx_guild_id ON guild_assignments(guild_id);
```

## Testing

### Devnet Testing

1. Update `.env.local`:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

2. Deploy test NFT collection to devnet

3. Set update authority private key

4. Test guild assignment flow

### Local Testing

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test API endpoint
curl -X POST http://localhost:3000/api/guild/assign \
  -H "Content-Type: application/json" \
  -d '{
    "nftMint": "test_mint_address",
    "tokenNumber": 1234,
    "guildId": "builder",
    "walletAddress": "test_wallet_address",
    "transactionSignature": "test_signature"
  }'
```

## Monitoring

Key metrics to monitor:

- Guild assignment success rate
- API response times
- Failed update transactions
- Distribution of guilds selected
- Active wallet addresses

## Future Enhancements

1. **Database Integration**
   - Track all guild assignments
   - Analytics and reporting
   - Guild member counts

2. **Batch Updates**
   - Support updating multiple NFTs
   - Bulk guild assignments

3. **Webhooks**
   - Notify external systems of assignments
   - Discord notifications

4. **Admin Dashboard**
   - View all assignments
   - Guild statistics
   - Manual override capabilities

## References

- [Metaplex Token Metadata Documentation](https://developers.metaplex.com/token-metadata)
- [Metaplex Update Metadata Guide](https://developers.metaplex.com/token-metadata/update)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [Umi Framework Documentation](https://developers.metaplex.com/umi)
