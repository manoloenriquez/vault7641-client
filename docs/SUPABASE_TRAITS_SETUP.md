# Supabase Traits Setup Guide

This guide explains how to upload trait assets to Supabase Storage for the NFT regeneration system.

## Prerequisites

1. Supabase project created
2. Storage bucket named `traits` (or custom name set via `SUPABASE_TRAITS_BUCKET`)
3. Service role key for server-side access

## Directory Structure

Upload your trait assets following this structure in the `traits` bucket:

```
traits/
├── 01-Guild Backgrounds/
│   ├── builder_guild_background.png
│   ├── farmer_guild_background.png
│   ├── gamer_guild_background.png
│   ├── pathfinder_guild_background.png
│   └── trader_guild_background.png
├── 02-Body/
│   ├── 10_light_skin_male.png
│   ├── 10_medium_skin_male.png
│   ├── 10_dark_skin_male.png
│   ├── 10_light_skin_female.png
│   └── ...
├── 03-Mouth/
│   ├── 5_smile_male.png
│   ├── 5_frown_male.png
│   └── ...
├── 04-Eyes/
│   ├── 8_happy_eyes_male.png
│   └── ...
├── 05-Outfits/
│   ├── Builder Guild/
│   │   ├── 15_work_vest_male.png
│   │   ├── 15_work_vest_female.png
│   │   └── ...
│   ├── Farmer Guild/
│   │   ├── 20_overalls_male.png
│   │   └── ...
│   ├── Gamer Guild/
│   ├── Pathfinder Guild/
│   ├── Trader Guild/
│   └── General/
│       ├── 10_casual_shirt_male.png
│       └── ...
├── 06-Hair/
│   ├── 5_buzz_cut_male.png
│   ├── 10_long_hair_female.png
│   └── ...
├── 07-Headwear/
│   ├── Builder Guild/
│   │   ├── 8_welding_mask_male.png
│   │   └── ...
│   ├── Farmer Guild/
│   ├── Gamer Guild/
│   ├── Pathfinder Guild/
│   ├── Trader Guild/
│   └── General/
├── 08-Hand/
│   ├── 10_light_skin_male.png
│   ├── 10_medium_skin_male.png
│   └── ...
└── 09-Hand Gear/
    ├── Builder Guild/
    ├── Farmer Guild/
    ├── Gamer Guild/
    ├── Pathfinder Guild/
    ├── Trader Guild/
    └── General/
```

## File Naming Convention

All trait files must follow this pattern:

```
{rarity}_{trait_name}_{gender}.png
```

Examples:
- `10_light_skin_male.png` - Rarity 10, light skin tone, male
- `5_buzz_cut_male.png` - Rarity 5, buzz cut hair, male
- `15_work_vest_female.png` - Rarity 15, work vest outfit, female

### Key Rules:

1. **Rarity prefix**: Numeric value at the start determines selection weight (higher = more common)
2. **Trait name**: Descriptive name of the trait (e.g., "light_skin", "buzz_cut", "work_vest")
3. **Gender suffix**: Must end with `_male.png` or `_female.png` (case-insensitive)
4. **Guild-specific folders**: Traits in `05-Outfits`, `07-Headwear`, and `09-Hand Gear` can be organized by guild

## Upload Methods

### Option 1: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Storage** → **traits** bucket
3. Click **Upload file** or **Upload folder**
4. Upload maintaining the directory structure above

### Option 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Upload files
supabase storage upload traits/01-Guild\ Backgrounds ./local-traits/01-Guild\ Backgrounds
```

### Option 3: Programmatic Upload (Node.js)

Create a script `scripts/upload-traits.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadDirectory(localPath: string, bucketPath: string) {
  const files = fs.readdirSync(localPath, { withFileTypes: true })
  
  for (const file of files) {
    const fullPath = path.join(localPath, file.name)
    const remotePath = `${bucketPath}/${file.name}`
    
    if (file.isDirectory()) {
      await uploadDirectory(fullPath, remotePath)
    } else if (file.isFile() && file.name.endsWith('.png')) {
      const fileBuffer = fs.readFileSync(fullPath)
      const { error } = await supabase.storage
        .from('traits')
        .upload(remotePath, fileBuffer, {
          contentType: 'image/png',
          upsert: true,
        })
      
      if (error) {
        console.error(`Failed to upload ${remotePath}:`, error)
      } else {
        console.log(`✅ Uploaded ${remotePath}`)
      }
    }
  }
}

// Usage
uploadDirectory('./local-traits', '')
```

## Verification

After uploading, verify your structure:

1. Check that all 9 trait directories exist
2. Verify guild-specific folders exist in `05-Outfits`, `07-Headwear`, `09-Hand Gear`
3. Ensure all PNG files follow the naming convention
4. Test image generation via `/sandbox` page

## Troubleshooting

### Missing Layers

If images are missing layers, check:
- File paths match exactly (case-sensitive)
- Gender suffix matches (`_male.png` or `_female.png`)
- Rarity prefix is numeric
- Files are actually PNG format

### Server Errors

If the server can't access files:
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (not anon key)
- Check bucket name matches `SUPABASE_TRAITS_BUCKET` (default: `traits`)
- Ensure bucket has public read access OR service role has read access

### Performance

- Files are cached for 5 minutes after first listing
- Consider CDN for faster access
- Optimize PNG file sizes (use tools like `pngquant`)

## Next Steps

Once assets are uploaded:
1. Test generation via `/sandbox` page
2. Verify all guilds and genders work correctly
3. Check that rarity weighting produces expected distributions
4. Monitor server logs for missing file warnings

