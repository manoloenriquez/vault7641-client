# NFT Regeneration System - Setup Checklist

This checklist helps you complete the setup for the NFT art regeneration system.

## ✅ 1. Upload Trait Assets to Supabase

### Steps:
1. **Create Supabase Storage Bucket**
   - Go to Supabase Dashboard → Storage
   - Create a bucket named `traits` (or set custom name via `SUPABASE_TRAITS_BUCKET`)
   - Set bucket to public OR ensure service role has read access

2. **Upload Trait Files**
   - Follow the structure in [`SUPABASE_TRAITS_SETUP.md`](./SUPABASE_TRAITS_SETUP.md)
   - Ensure all 9 trait directories exist:
     - `01-Guild Backgrounds/`
     - `02-Body/`
     - `03-Mouth/`
     - `04-Eyes/`
     - `05-Outfits/` (with guild subfolders)
     - `06-Hair/`
     - `07-Headwear/` (with guild subfolders)
     - `08-Hand/`
     - `09-Hand Gear/` (with guild subfolders)

3. **Verify File Naming**
   - All files must follow: `{rarity}_{trait_name}_{gender}.png`
   - Examples: `10_light_skin_male.png`, `5_buzz_cut_female.png`
   - Gender suffix must be `_male.png` or `_female.png`

4. **Test Upload**
   - Use Supabase dashboard to verify files are accessible
   - Check that guild-specific folders exist in `05-Outfits`, `07-Headwear`, `09-Hand Gear`

**Status:** ☐ Complete

---

## ✅ 2. Verify Environment Variables

### Required Variables:

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_TRAITS_BUCKET=traits  # Optional, defaults to 'traits'

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com  # Optional

# Update Authority (one of these)
NFT_UPDATE_AUTHORITY_PRIVATE_KEY=5Kb8...xyz  # Base58 format
# OR
ADMIN_KEYPAIR_JSON=[1,2,3,...,64]  # JSON array format

# Optional
NEXT_PUBLIC_NFT_COLLECTION_ADDRESS=So11111111111111111111111111111111111111112
NEXT_PUBLIC_METADATA_BASE_URL=https://gateway.lighthouse.storage/ipfs/...
```

### Verification:

Run the environment check script:
```bash
npx tsx scripts/check-env.ts
```

Or manually verify:
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set (service role, not anon key!)
- `SOLANA_RPC_URL` is set and accessible
- `NFT_UPDATE_AUTHORITY_PRIVATE_KEY` or `ADMIN_KEYPAIR_JSON` is set and valid
- Wallet adapters match your RPC URL configuration

**Status:** ☐ Complete

---

## ✅ 3. Seed Data for Guild/Gender

### Current Implementation:

The system extracts guild and gender from NFT metadata attributes:
- **Guild**: Looks for `trait_type: 'Guild'` attribute
- **Gender**: Looks for `trait_type: 'Gender'` attribute

### Check Your NFTs:

1. **Verify Metadata Structure**
   - Check that your NFT metadata JSON includes:
     ```json
     {
       "attributes": [
         { "trait_type": "Guild", "value": "Builder Guild" },
         { "trait_type": "Gender", "value": "Male" }
       ]
     }
     ```

2. **Backfill Missing Data** (if needed)
   - If older NFTs lack gender info, you may need to:
     - Update metadata to include Gender attribute
     - Or store guild/gender in a separate database
     - Or hardcode defaults in the component

3. **Test Extraction**
   - The `extractGender` function in `guild-selection-feature.tsx` handles extraction
   - Verify it works with your metadata format

**Status:** ☐ Complete

---

## ✅ 4. Test Generation via Sandbox

### Steps:

1. **Start Development Server**
   ```bash
   yarn dev
   ```

2. **Navigate to Sandbox**
   - Go to `http://localhost:3000/sandbox`

3. **Test Image Generation**
   - Enter a token ID (e.g., `1`)
   - Select a guild (e.g., "Builder Guild")
   - Select a gender (e.g., "Male")
   - Click "Generate Image"
   - Verify the preview shows correctly

4. **Test Upload to Arweave**
   - Connect a funded wallet (needs SOL for Bundlr/Irys fees)
   - Click "Generate & Upload to Arweave"
   - Wait for upload to complete
   - Verify:
     - Image URI is returned
     - Metadata URI is returned
     - Both URIs are accessible

5. **Verify Metadata JSON**
   - Open the metadata URI in a browser
   - Check that it includes:
     - Correct image URI
     - Guild and Gender attributes
     - All expected fields

**Status:** ☐ Complete

---

## ✅ 5. End-to-End Regeneration

### Steps:

1. **Navigate to Guild Selection**
   - Go to `/guild-selection` page
   - Connect wallet with NFTs

2. **Select an NFT**
   - Choose an NFT from your collection
   - Verify it shows guild and gender info

3. **Regenerate Art**
   - Click "Regenerate art" button
   - Approve wallet transaction (Bundlr upload)
   - Wait for completion

4. **Verify Transaction**
   - Check transaction signature in status message
   - Open Solana Explorer: `https://explorer.solana.com/tx/{signature}`
   - Verify transaction succeeded

5. **Verify Metadata Update**
   - Check that on-chain metadata URI updated
   - Open new metadata URI
   - Verify image URI points to new Arweave location
   - Wait for cache expiry (or clear cache)
   - Verify NFT image updates in UI

**Status:** ☐ Complete

---

## ✅ 6. Add Persistence (Optional but Recommended)

### Steps:

1. **Create Supabase Table**
   - Run the SQL in [`SUPABASE_SCHEMA.sql`](./SUPABASE_SCHEMA.sql)
   - Creates `nft_regeneration_logs` table
   - Sets up indexes for performance

2. **Verify Logging Works**
   - After a regeneration, check Supabase table
   - Verify log entry was created with:
     - tokenId, nftMint, guild, gender
     - seed, metadataUri, imageUri
     - transactionSignature, walletAddress
     - timestamp

3. **Query Logs** (optional)
   - Use GET `/api/nft/regenerate-log?tokenId=X` to fetch history
   - Or query Supabase directly:
     ```sql
     SELECT * FROM nft_regeneration_logs 
     WHERE nft_mint = '...' 
     ORDER BY created_at DESC;
     ```

4. **Use Logs for Reproducibility**
   - Store seed per token for deterministic regeneration
   - Track regeneration history per NFT
   - Audit trail for all changes

**Status:** ☐ Complete

---

## 🎯 Quick Verification Commands

```bash
# Check environment variables
npx tsx scripts/check-env.ts

# Test Supabase connection (create a test script)
# Test image generation API
curl "http://localhost:3000/api/generate-image/1?guild=Builder%20Guild&gender=Male"

# Check logs
curl "http://localhost:3000/api/nft/regenerate-log?tokenId=1"
```

## 📝 Notes

- **Supabase Storage**: Ensure service role key has read access to traits bucket
- **Arweave Upload**: User pays fees via Bundlr/Irys (needs SOL in wallet)
- **Metadata Updates**: Server signs as update authority, user pays transaction fee
- **Caching**: Trait file lists are cached for 5 minutes
- **Seeds**: Using same seed + tokenId produces same traits (deterministic)

## 🐛 Troubleshooting

### Images not generating?
- Check Supabase bucket structure matches expected format
- Verify file naming convention (rarity_trait_gender.png)
- Check server logs for missing file warnings

### Upload failing?
- Verify wallet has SOL for fees
- Check Bundlr/Irys network status
- Verify RPC URL is accessible

### Metadata not updating?
- Verify update authority keypair is correct
- Check transaction signature on Solana Explorer
- Ensure NFT is mutable

### Logging not working?
- Verify Supabase table exists
- Check service role key has insert permissions
- Review server logs for errors

---

**Last Updated:** $(date)
**Status:** Ready for testing

