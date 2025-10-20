# Metadata Template Generator

Use these templates to create your NFT metadata files.

## Base Pass Metadata Template

Save as: `/public/art/[tokenNumber].json`

```json
{
  "name": "Vault 7641 Base Pass #[TOKEN_NUMBER]",
  "symbol": "V7641",
  "description": "Vault 7641 Base Pass - Select your guild to begin your journey.",
  "image": "https://vault7641.com/art/pass.png",
  "external_url": "https://vault7641.com",
  "attributes": [
    {
      "trait_type": "Type",
      "value": "Base Pass"
    },
    {
      "trait_type": "Status",
      "value": "Unrevealed"
    },
    {
      "trait_type": "Token Number",
      "value": [TOKEN_NUMBER]
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://vault7641.com/art/pass.png",
        "type": "image/png"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "[YOUR_CREATOR_ADDRESS]",
        "share": 100
      }
    ]
  }
}
```

## Guild Metadata Templates

### Builder Guild

Save as: `/public/art/builder/[tokenNumber].json`

```json
{
  "name": "Vault 7641 Builder #[TOKEN_NUMBER]",
  "symbol": "V7641",
  "description": "Vault 7641 Builder Guild Member - For Web3 engineers, designers, data researchers, automators, founders, product designers, anyone who builds & ships.",
  "image": "https://vault7641.com/art/builder/[TOKEN_NUMBER].png",
  "external_url": "https://vault7641.com/guilds/builder",
  "attributes": [
    {
      "trait_type": "Guild",
      "value": "Builder"
    },
    {
      "trait_type": "Status",
      "value": "Revealed"
    },
    {
      "trait_type": "Token Number",
      "value": [TOKEN_NUMBER]
    },
    {
      "trait_type": "Rarity",
      "value": "Guild Member"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://vault7641.com/art/builder/[TOKEN_NUMBER].png",
        "type": "image/png"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "[YOUR_CREATOR_ADDRESS]",
        "share": 100
      }
    ]
  }
}
```

### Trader Guild

Save as: `/public/art/trader/[tokenNumber].json`

```json
{
  "name": "Vault 7641 Trader #[TOKEN_NUMBER]",
  "symbol": "V7641",
  "description": "Vault 7641 Trader Guild Member - For new and experienced traders & investors who want structured, real market insights, clear setups & opportunities.",
  "image": "https://vault7641.com/art/trader/[TOKEN_NUMBER].png",
  "external_url": "https://vault7641.com/guilds/trader",
  "attributes": [
    {
      "trait_type": "Guild",
      "value": "Trader"
    },
    {
      "trait_type": "Status",
      "value": "Revealed"
    },
    {
      "trait_type": "Token Number",
      "value": [TOKEN_NUMBER]
    },
    {
      "trait_type": "Rarity",
      "value": "Guild Member"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://vault7641.com/art/trader/[TOKEN_NUMBER].png",
        "type": "image/png"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "[YOUR_CREATOR_ADDRESS]",
        "share": 100
      }
    ]
  }
}
```

### Farmer Guild

Save as: `/public/art/farmer/[tokenNumber].json`

```json
{
  "name": "Vault 7641 Farmer #[TOKEN_NUMBER]",
  "symbol": "V7641",
  "description": "Vault 7641 Farmer Guild Member - For DeFi participants, airdrop hunters, points farmers, and yield strategists.",
  "image": "https://vault7641.com/art/farmer/[TOKEN_NUMBER].png",
  "external_url": "https://vault7641.com/guilds/farmer",
  "attributes": [
    {
      "trait_type": "Guild",
      "value": "Farmer"
    },
    {
      "trait_type": "Status",
      "value": "Revealed"
    },
    {
      "trait_type": "Token Number",
      "value": [TOKEN_NUMBER]
    },
    {
      "trait_type": "Rarity",
      "value": "Guild Member"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://vault7641.com/art/farmer/[TOKEN_NUMBER].png",
        "type": "image/png"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "[YOUR_CREATOR_ADDRESS]",
        "share": 100
      }
    ]
  }
}
```

### Gamer Guild

Save as: `/public/art/gamer/[tokenNumber].json`

```json
{
  "name": "Vault 7641 Gamer #[TOKEN_NUMBER]",
  "symbol": "V7641",
  "description": "Vault 7641 Gamer Guild Member - For P2E gamers, NFT collectors, flippers, and enjoyers of game economies.",
  "image": "https://vault7641.com/art/gamer/[TOKEN_NUMBER].png",
  "external_url": "https://vault7641.com/guilds/gamer",
  "attributes": [
    {
      "trait_type": "Guild",
      "value": "Gamer"
    },
    {
      "trait_type": "Status",
      "value": "Revealed"
    },
    {
      "trait_type": "Token Number",
      "value": [TOKEN_NUMBER]
    },
    {
      "trait_type": "Rarity",
      "value": "Guild Member"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://vault7641.com/art/gamer/[TOKEN_NUMBER].png",
        "type": "image/png"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "[YOUR_CREATOR_ADDRESS]",
        "share": 100
      }
    ]
  }
}
```

### Pathfinder Guild

Save as: `/public/art/pathfinder/[tokenNumber].json`

```json
{
  "name": "Vault 7641 Pathfinder #[TOKEN_NUMBER]",
  "symbol": "V7641",
  "description": "Vault 7641 Pathfinder Guild Member - For Marketers, CMs, devs, analysts, designers, students, unemployed, and professionals who want Web3 careers.",
  "image": "https://vault7641.com/art/pathfinder/[TOKEN_NUMBER].png",
  "external_url": "https://vault7641.com/guilds/pathfinder",
  "attributes": [
    {
      "trait_type": "Guild",
      "value": "Pathfinder"
    },
    {
      "trait_type": "Status",
      "value": "Revealed"
    },
    {
      "trait_type": "Token Number",
      "value": [TOKEN_NUMBER]
    },
    {
      "trait_type": "Rarity",
      "value": "Guild Member"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://vault7641.com/art/pathfinder/[TOKEN_NUMBER].png",
        "type": "image/png"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "[YOUR_CREATOR_ADDRESS]",
        "share": 100
      }
    ]
  }
}
```

## Batch Generation Script

You can use this Node.js script to generate all metadata files:

```javascript
const fs = require('fs')
const path = require('path')

const TOTAL_TOKENS = 7641
const BASE_URL = 'https://vault7641.com'
const CREATOR_ADDRESS = 'YOUR_CREATOR_ADDRESS_HERE'

const guilds = [
  {
    id: 'builder',
    name: 'Builder',
    description:
      'For Web3 engineers, designers, data researchers, automators, founders, product designers, anyone who builds & ships.',
  },
  {
    id: 'trader',
    name: 'Trader',
    description:
      'For new and experienced traders & investors who want structured, real market insights, clear setups & opportunities.',
  },
  {
    id: 'farmer',
    name: 'Farmer',
    description: 'For DeFi participants, airdrop hunters, points farmers, and yield strategists.',
  },
  {
    id: 'gamer',
    name: 'Gamer',
    description: 'For P2E gamers, NFT collectors, flippers, and enjoyers of game economies.',
  },
  {
    id: 'pathfinder',
    name: 'Pathfinder',
    description:
      'For Marketers, CMs, devs, analysts, designers, students, unemployed, and professionals who want Web3 careers.',
  },
]

// Generate base pass metadata
function generateBasePassMetadata(tokenNumber) {
  return {
    name: `Vault 7641 Base Pass #${tokenNumber}`,
    symbol: 'V7641',
    description: 'Vault 7641 Base Pass - Select your guild to begin your journey.',
    image: `${BASE_URL}/art/pass.png`,
    external_url: BASE_URL,
    attributes: [
      { trait_type: 'Type', value: 'Base Pass' },
      { trait_type: 'Status', value: 'Unrevealed' },
      { trait_type: 'Token Number', value: tokenNumber },
    ],
    properties: {
      files: [{ uri: `${BASE_URL}/art/pass.png`, type: 'image/png' }],
      category: 'image',
      creators: [{ address: CREATOR_ADDRESS, share: 100 }],
    },
  }
}

// Generate guild metadata
function generateGuildMetadata(tokenNumber, guild) {
  return {
    name: `Vault 7641 ${guild.name} #${tokenNumber}`,
    symbol: 'V7641',
    description: `Vault 7641 ${guild.name} Guild Member - ${guild.description}`,
    image: `${BASE_URL}/art/${guild.id}/${tokenNumber}.png`,
    external_url: `${BASE_URL}/guilds/${guild.id}`,
    attributes: [
      { trait_type: 'Guild', value: guild.name },
      { trait_type: 'Status', value: 'Revealed' },
      { trait_type: 'Token Number', value: tokenNumber },
      { trait_type: 'Rarity', value: 'Guild Member' },
    ],
    properties: {
      files: [{ uri: `${BASE_URL}/art/${guild.id}/${tokenNumber}.png`, type: 'image/png' }],
      category: 'image',
      creators: [{ address: CREATOR_ADDRESS, share: 100 }],
    },
  }
}

// Create directories
const artDir = path.join(__dirname, 'public', 'art')
if (!fs.existsSync(artDir)) {
  fs.mkdirSync(artDir, { recursive: true })
}

guilds.forEach((guild) => {
  const guildDir = path.join(artDir, guild.id)
  if (!fs.existsSync(guildDir)) {
    fs.mkdirSync(guildDir, { recursive: true })
  }
})

// Generate all metadata files
console.log('Generating metadata files...')

for (let i = 1; i <= TOTAL_TOKENS; i++) {
  // Base pass metadata
  const baseMetadata = generateBasePassMetadata(i)
  fs.writeFileSync(path.join(artDir, `${i}.json`), JSON.stringify(baseMetadata, null, 2))

  // Guild metadata
  guilds.forEach((guild) => {
    const guildMetadata = generateGuildMetadata(i, guild)
    fs.writeFileSync(path.join(artDir, guild.id, `${i}.json`), JSON.stringify(guildMetadata, null, 2))
  })

  if (i % 100 === 0) {
    console.log(`Generated ${i}/${TOTAL_TOKENS} metadata files...`)
  }
}

console.log('✅ All metadata files generated!')
console.log(`Total files: ${TOTAL_TOKENS * (guilds.length + 1)}`)
```

Save this as `generate-metadata.js` and run:

```bash
node generate-metadata.js
```

## Important Notes

1. **Replace Placeholders**:
   - `[TOKEN_NUMBER]` → Your actual token number (1-7641)
   - `[YOUR_CREATOR_ADDRESS]` → Your Solana wallet address
   - `https://vault7641.com` → Your actual domain

2. **Image Requirements**:
   - Format: PNG recommended
   - Size: 1000x1000px or higher
   - Hosted on CDN or IPFS
   - Publicly accessible

3. **Validation**:
   - Ensure all JSON is valid
   - Test URLs are accessible
   - Verify image paths match
   - Check metadata standards compliance

4. **Testing**:
   Test your metadata with:

   ```bash
   curl https://vault7641.com/art/1.json
   curl https://vault7641.com/art/builder/1.json
   ```

5. **Marketplace Compatibility**:
   This format is compatible with:
   - Magic Eden
   - OpenSea
   - Tensor
   - All major Solana NFT marketplaces
