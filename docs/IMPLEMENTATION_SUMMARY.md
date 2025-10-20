# Guild Selection Implementation Summary

## What Was Created

### 1. Backend API Endpoint

**File**: `src/app/api/guild/assign/route.ts`

A Next.js API route that:

- Accepts guild assignment requests from the frontend
- Uses Metaplex SDK to update NFT metadata on-chain
- Updates the NFT's URI to point to guild-specific metadata
- Returns success/failure status

**Key Features**:

- Validates NFT ownership
- Validates guild IDs
- Uses update authority wallet to sign metadata updates
- Supports both POST (assign) and GET (query) operations

### 2. Environment Configuration

**File**: `.env.example`

Template for environment variables:

- `NEXT_PUBLIC_SOLANA_RPC_URL` - Solana RPC endpoint
- `NFT_UPDATE_AUTHORITY_PRIVATE_KEY` - Private key for metadata updates
- `NEXT_PUBLIC_METADATA_BASE_URL` - Base URL for metadata hosting

### 3. NFT Operations Library

**File**: `src/lib/solana/nft-operations.ts`

Utility functions for:

- Fetching user's NFTs from blockchain
- Creating metadata update transactions
- Checking guild assignments
- Fetching metadata from URIs

### 4. Documentation

**Files**:

- `docs/BACKEND_GUILD_FLOW.md` - Complete backend flow documentation
- `docs/SETUP_GUIDE.md` - Step-by-step setup instructions

**Documentation Includes**:

- Architecture overview
- API endpoint specifications
- Metadata structure and format
- Security considerations
- Testing procedures
- Deployment guide

### 5. Updated Dependencies

**File**: `package.json`

Added Metaplex SDK packages:

- `@metaplex-foundation/mpl-token-metadata` - Token metadata program
- `@metaplex-foundation/umi` - Metaplex framework
- `@metaplex-foundation/umi-bundle-defaults` - Umi defaults
- `@solana/spl-token` - SPL token operations

## How It Works

### User Flow

1. **User connects wallet** → Solana wallet adapter connects
2. **User views their NFTs** → Frontend fetches NFTs via `getUserNFTs()`
3. **User selects guild** → Guild selection modal opens
4. **User confirms** → Transaction is created and sent to wallet for signing
5. **Backend updates metadata** → API endpoint updates NFT URI on-chain
6. **Success!** → NFT now displays guild-specific image and metadata

### Technical Flow

```
Frontend                  Backend                   Blockchain
   |                         |                          |
   |---Select Guild--------->|                          |
   |                         |                          |
   |<--Create Transaction----|                          |
   |                         |                          |
   |---Sign & Send-------------------------------->|
   |                         |                          |
   |<--Transaction Confirmed-----------------------|
   |                         |                          |
   |---POST /api/guild/assign>|                         |
   |                         |                          |
   |                         |---Update Metadata------->|
   |                         |                          |
   |                         |<--Confirmation-----------|
   |                         |                          |
   |<--Success Response------|                          |
```

## Metadata Structure

### Before Guild Selection

- Image: `/art/pass.png`
- Metadata: `/art/[tokenNumber].json`
- Status: "Unrevealed"

### After Guild Selection

- Image: `/art/[guild-name]/[tokenNumber].png`
- Metadata: `/art/[guild-name]/[tokenNumber].json`
- Status: "Revealed"
- Attribute: Guild name added

## Guilds Available

1. **Builder** - For developers, designers, and creators
2. **Trader** - For traders and investors
3. **Farmer** - For DeFi participants and airdrop hunters
4. **Gamer** - For P2E gamers and NFT collectors
5. **Pathfinder** - For career seekers and professionals

## Next Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` with:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NFT_UPDATE_AUTHORITY_PRIVATE_KEY=[your,private,key,array]
NEXT_PUBLIC_METADATA_BASE_URL=https://vault7641.com
```

### 3. Prepare Metadata

- Create base pass metadata: `/public/art/[1-7641].json`
- Create guild-specific metadata: `/public/art/[guild]/[1-7641].json`
- Create guild-specific images: `/public/art/[guild]/[1-7641].png`

### 4. Deploy Metadata

Upload all metadata and images to a public server (CDN, IPFS, or web hosting).

### 5. Test on Devnet

- Switch to devnet RPC
- Deploy test NFT collection
- Test guild selection flow
- Verify metadata updates

### 6. Deploy to Production

- Deploy to Vercel
- Set environment variables
- Test with real NFTs
- Monitor for issues

## Security Considerations

### Critical

- ✅ Store `NFT_UPDATE_AUTHORITY_PRIVATE_KEY` securely
- ✅ Never commit private keys to git
- ✅ Use environment variables for all secrets
- ✅ Validate NFT ownership before updates
- ✅ Rate limit API endpoints

### Recommended

- 🔒 Use multisig wallet for update authority
- 🔒 Set up monitoring and alerts
- 🔒 Log all transactions for audit trail
- 🔒 Implement database for tracking assignments
- 🔒 Add admin dashboard for oversight

## API Usage Example

### Frontend Call

```typescript
// In your React component
const { selectGuild } = useGuildSelection()

const handleGuildSelect = async () => {
  const result = await selectGuild(nftMint, 'builder', tokenNumber)
  if (result.success) {
    console.log('Guild assigned!', result.transactionSignature)
  }
}
```

### Backend Response

```json
{
  "success": true,
  "data": {
    "nftMint": "ABC123...",
    "tokenNumber": 1234,
    "guildId": "builder",
    "newUri": "https://vault7641.com/art/builder/1234.json",
    "transactionSignature": "5Xg7..."
  }
}
```

## Files Created/Modified

### New Files

- ✅ `src/app/api/guild/assign/route.ts` - API endpoint
- ✅ `src/lib/solana/nft-operations.ts` - NFT operations
- ✅ `.env.example` - Environment template
- ✅ `docs/BACKEND_GUILD_FLOW.md` - Backend documentation
- ✅ `docs/SETUP_GUIDE.md` - Setup instructions

### Modified Files

- ✅ `package.json` - Added Metaplex dependencies

## Testing Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Configure environment variables
- [ ] Prepare metadata files
- [ ] Test on devnet
  - [ ] Connect wallet
  - [ ] Fetch NFTs
  - [ ] Select guild
  - [ ] Verify metadata update
- [ ] Deploy to production
- [ ] Test on mainnet
- [ ] Monitor for issues

## Support & Resources

### Documentation

- [Setup Guide](./SETUP_GUIDE.md)
- [Backend Flow](./BACKEND_GUILD_FLOW.md)

### External Resources

- [Metaplex Docs](https://developers.metaplex.com)
- [Solana Docs](https://docs.solana.com)
- [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

### Need Help?

1. Check console logs for errors
2. Review API endpoint logs
3. Verify environment variables
4. Test on devnet first
5. Check Solana explorer for transactions

## Maintenance

### Regular Tasks

- Monitor API response times
- Check failed transactions
- Review guild distribution stats
- Update metadata as needed
- Rotate keys periodically

### Analytics to Track

- Total guild assignments
- Success/failure rates
- Popular guilds
- Active wallets
- Transaction costs

## Future Enhancements

### Phase 1 (Current)

- ✅ Basic guild selection
- ✅ Metadata updates
- ✅ API endpoint

### Phase 2 (Next)

- [ ] Database integration
- [ ] Analytics dashboard
- [ ] Guild member counts
- [ ] Assignment history

### Phase 3 (Future)

- [ ] Batch updates
- [ ] Webhooks
- [ ] Discord notifications
- [ ] Admin override capabilities
- [ ] Guild transfer (if needed)

---

**Implementation Date**: October 2025
**Blockchain**: Solana
**Framework**: Next.js 15, Metaplex Token Metadata
**Status**: Ready for testing
