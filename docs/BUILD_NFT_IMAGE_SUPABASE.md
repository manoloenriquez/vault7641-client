# Build NFT Image - Supabase Integration Guide

## ✅ Current Status

Your `buildNftImage.ts` function **already integrates with Supabase Storage**! Here's what's already implemented:

### What's Working:

1. **Supabase Client Setup** ✅
   - Uses `getSupabaseServerClient()` from `@/lib/supabase/server`
   - Reads bucket name from `SUPABASE_TRAITS_BUCKET` env var (defaults to `'traits'`)
   - Client is cached for performance

2. **File Listing** ✅
   - `listTraitFiles(path)` function lists files from Supabase storage
   - Caches results for 5 minutes to reduce API calls
   - Handles errors gracefully

3. **File Downloading** ✅
   - `downloadLayer(path)` function downloads PNG files from Supabase
   - Converts to Sharp overlay format
   - Returns null if file missing (graceful degradation)

4. **Trait Selection** ✅
   - Selects traits from Supabase directories
   - Handles guild-specific folders (05-Outfits, 07-Headwear, 09-Hand Gear)
   - Filters by gender suffix (`_male.png` or `_female.png`)
   - Uses weighted rarity system

## 📁 Expected Supabase Bucket Structure

Your code expects this structure in the `traits` bucket:

```
traits/
├── 01-Guild Backgrounds/
│   ├── builder_guild_background.png
│   ├── farmer_guild_background.png
│   └── ...
├── 02-Body/
│   ├── 10_light_skin_male.png
│   ├── 10_medium_skin_male.png
│   └── ...
├── 03-Mouth/
│   ├── 5_smile_male.png
│   └── ...
├── 04-Eyes/
│   └── ...
├── 05-Outfits/
│   ├── Builder Guild/
│   │   ├── 15_work_vest_male.png
│   │   └── ...
│   ├── Farmer Guild/
│   ├── Gamer Guild/
│   ├── Pathfinder Guild/
│   ├── Trader Guild/
│   └── General/
├── 06-Hair/
│   ├── 5_buzz_cut_male.png
│   └── ...
├── 07-Headwear/
│   ├── Builder Guild/
│   ├── Farmer Guild/
│   ├── Gamer Guild/
│   ├── Pathfinder Guild/
│   ├── Trader Guild/
│   └── General/
├── 08-Hand/
│   └── ...
└── 09-Hand Gear/
    ├── Builder Guild/
    ├── Farmer Guild/
    ├── Gamer Guild/
    ├── Pathfinder Guild/
    ├── Trader Guild/
    └── General/
```

## 🔧 How It Works

### 1. Listing Files

```typescript
// Lists all PNG files in a directory
const files = await listTraitFiles('05-Outfits/Builder Guild')
// Returns: ['15_work_vest_male.png', '10_casual_shirt_female.png', ...]
```

### 2. Downloading Files

```typescript
// Downloads a PNG file and converts to Sharp overlay
const overlay = await downloadLayer('05-Outfits/Builder Guild/15_work_vest_male.png')
// Returns: { input: Buffer, blend: 'over' } or null if missing
```

### 3. Path Construction

The code constructs paths like this:
- **Simple trait**: `02-Body/10_light_skin_male.png`
- **Guild-specific**: `05-Outfits/Builder Guild/15_work_vest_male.png`
- **Fallback**: `05-Outfits/General/10_casual_shirt_male.png`

## ⚠️ Potential Issues & Fixes

### Issue 1: Nose Layer Path

**Location**: Line 326 in `buildLayerPaths`

**Problem**: 
```typescript
layers.push(`Nose_${gender}.png`)  // Missing directory prefix!
```

**Fix**: Update to include directory:
```typescript
layers.push(`02-Body/Nose_${gender}.png`)  // Or wherever nose files are stored
```

**OR** if nose files are in a separate directory:
```typescript
layers.push(`Nose/Nose_${gender}.png`)
```

### Issue 2: Background File Selection

**Location**: Lines 309-315

**Current**: Searches for guild name in filename
```typescript
const background = backgrounds.find((file) => 
  file.toLowerCase().includes(guild.toLowerCase())
) ?? backgrounds[0]
```

**Note**: This assumes background files contain guild name. If your files are named differently, update the matching logic.

### Issue 3: Error Handling

The code handles missing files gracefully:
- Returns empty array if directory doesn't exist
- Returns null if file doesn't exist
- Falls back to solid color PNG if no layers found

## ✅ Verification Checklist

1. **Environment Variables Set**:
   ```bash
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_TRAITS_BUCKET=traits  # Optional, defaults to 'traits'
   ```

2. **Bucket Created**:
   - Create `traits` bucket in Supabase Storage
   - Ensure service role has read access

3. **Files Uploaded**:
   - Upload trait PNGs following the structure above
   - Verify file naming: `{rarity}_{trait}_{gender}.png`

4. **Test Generation**:
   ```bash
   # Test via API
   curl "http://localhost:3000/api/generate-image/1?guild=Builder%20Guild&gender=Male"
   ```

## 🐛 Debugging Tips

### Check Supabase Connection

Add logging to verify connection:
```typescript
const supabaseClient = getSupabaseServerClient()
console.log('Supabase client initialized:', !!supabaseClient)
```

### Test File Listing

Add a test endpoint:
```typescript
// In an API route
const files = await listTraitFiles('02-Body')
console.log('Files found:', files)
```

### Check File Paths

The code logs warnings when files are missing:
```
[traits] Missing layer 05-Outfits/Builder Guild/15_work_vest_male.png
```

Check:
1. Path matches exactly (case-sensitive)
2. File exists in Supabase Storage
3. Service role has read access

## 📝 Summary

**Your code is already set up to use Supabase!** You just need to:

1. ✅ Set environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
2. ✅ Create the `traits` bucket in Supabase Storage
3. ✅ Upload trait PNG files following the expected structure
4. ✅ Fix the nose layer path (line 326) if needed
5. ✅ Test generation via `/sandbox` page

The integration is complete - just upload your assets and test!

