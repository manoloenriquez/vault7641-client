# NFT Reveal Flow Documentation

## Overview

This document explains how the NFT reveal and guild assignment process works, including how the updated metadata and images are displayed.

## Flow Sequence

### 1. **User Initiates Reveal** (`nft-reveal-feature.tsx`)

- User selects an NFT from their wallet
- User chooses a guild to join
- Token number is extracted from NFT name (e.g., "Vault Pass #1234" → 1234)
- Client calls `/api/guild/assign` endpoint

### 2. **Server-Side Metadata Update** (`/api/guild/assign/route.ts`)

- Server loads update authority keypair from environment variable
- Verifies server has update authority over the NFT
- Constructs new metadata URI: `{baseUrl}/art/{guildId}/{tokenNumber}.json`
- Constructs new NFT name: `Vault 7641 - {Guild} #{tokenNumber}`
- Calls Metaplex Core `updateV1()` to update on-chain metadata
- Returns transaction signature and new metadata details

### 3. **Client Redirect** (`nft-reveal-feature.tsx`)

- On success, redirects to result page: `/reveal/{nftId}/result?guild={guildId}&tx={signature}`

### 4. **Metadata Polling & Display** (`reveal-result-feature.tsx`)

- Result page loads and begins polling for updated NFT data
- **Polling Logic:**
  - Fetches NFT data from `/api/nft/{nftId}`
  - Checks if `assignedGuild` matches the selected guild
  - Retries up to 10 times with 1-second delays
  - Ensures blockchain update has propagated before displaying

### 5. **Updated NFT Display**

The result page displays:

- ✅ **New guild-specific artwork** (automatically loaded from updated metadata URI)
- ✅ **Updated NFT name** (e.g., "Vault 7641 - Builder #1234")
- ✅ **Updated attributes** from the new metadata JSON
- ✅ **Guild assignment badge** showing the NFT is now a guild member
- ✅ **Metadata update confirmation** with visual indicators
- ✅ **Transaction signature** for verification on Solana Explorer

## Visual Enhancements

### Loading State

- Shows spinning loader with message: "Updating Your NFT..."
- Indicates metadata is being fetched from blockchain
- Purple-themed animation

### Success State

- **Confetti animation** on page load (3 seconds)
- **Trophy icon** celebration header
- **Guild gradient border** on NFT card
- **Revealed badge** in green
- **Metadata Updated badge** in purple
- **Zoom-in animation** on NFT image
- **Fade-in animation** on attribute badges (staggered)
- **Green confirmation box** explaining metadata update

### NFT Card

```
┌─────────────────────────────────────┐
│ [Guild Gradient Border at Top]     │
│                                     │
│  [Updated Guild-Specific Image]    │
│                                     │
│  ┌──────────┐  ┌──────────────┐   │
│  │ Revealed │  │ Metadata     │   │
│  │   ✓      │  │ Updated ✨   │   │
│  └──────────┘  └──────────────┘   │
│                                     │
│  ┌───────────────────────────┐    │
│  │ [Guild Badge]             │    │
│  │ Builder Guild - Member    │    │
│  └───────────────────────────┘    │
│                                     │
│  Vault 7641 - Builder #1234        │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ ✓ NFT Metadata Updated      │  │
│  │   On-Chain                  │  │
│  │                             │  │
│  │ Your NFT now displays the   │  │
│  │ exclusive Builder Guild     │  │
│  │ artwork and attributes.     │  │
│  └─────────────────────────────┘  │
│                                     │
│  Attributes:                        │
│  [Guild: Builder] [Type: Pass]     │
│  [Rarity: Legendary]                │
└─────────────────────────────────────┘
```

## Metadata Structure

### Before Reveal

```json
{
  "name": "Vault Pass #1234",
  "image": "https://vault7641.com/art/unrevealed/1234.png",
  "attributes": [{ "trait_type": "Status", "value": "Unrevealed" }]
}
```

### After Guild Assignment (Builder Example)

```json
{
  "name": "Vault 7641 - Builder #1234",
  "image": "https://vault7641.com/art/builder/1234.png",
  "attributes": [
    { "trait_type": "Guild", "value": "Builder" },
    { "trait_type": "Type", "value": "Pass" },
    { "trait_type": "Rarity", "value": "Legendary" },
    { "trait_type": "Status", "value": "Revealed" }
  ]
}
```

## Technical Details

### Polling Configuration

- **Max Attempts:** 10
- **Delay Between Attempts:** 1 second
- **Total Max Wait Time:** 10 seconds
- **Success Criteria:** `nftData.assignedGuild === selectedGuildId`

### Animation Timings

- **Confetti Duration:** 3 seconds
- **Image Zoom-In:** 700ms
- **Card Fade-In:** 500ms
- **Attribute Stagger:** 50ms per badge

### Error Handling

- If polling times out, still displays NFT (may show old data temporarily)
- If fetch fails, shows error toast and redirects to guild selection
- If NFT not found, shows "NFT Not Found" message with back button

## Environment Variables Required

```env
# Metadata base URL for NFT artwork
NEXT_PUBLIC_METADATA_BASE_URL=https://vault7641.com

# Server wallet private key (has update authority)
NFT_UPDATE_AUTHORITY_PRIVATE_KEY=[...]

# Solana RPC endpoint
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Key Features

1. ✅ **Real-time metadata updates** displayed immediately after on-chain confirmation
2. ✅ **Guild-specific artwork** automatically loaded from updated URI
3. ✅ **Polling mechanism** ensures data consistency before display
4. ✅ **Visual feedback** with animations and status badges
5. ✅ **Transaction verification** via Solana Explorer link
6. ✅ **Mobile responsive** design for all screen sizes
7. ✅ **Error resilience** with retry logic and fallbacks

## Future Enhancements

- [ ] Add database storage for faster guild assignment lookups
- [ ] Implement WebSocket for real-time updates instead of polling
- [ ] Add "Share to Twitter" functionality with guild-specific graphics
- [ ] Create leaderboard showing guild member counts
- [ ] Add guild-specific perks and unlockables based on on-chain data
