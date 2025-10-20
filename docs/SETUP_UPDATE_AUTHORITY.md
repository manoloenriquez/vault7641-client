# Setup Update Authority - Environment Variable Guide

## Problem

The error "Unexpected non-whitespace character after JSON at position 1" occurs when the `NFT_UPDATE_AUTHORITY_PRIVATE_KEY` environment variable is not properly formatted.

## Solution

### Step 1: Locate Your Keypair File

Your Solana keypair is typically located at:

```bash
~/.config/solana/id.json
```

Or if you created a custom keypair:

```bash
/path/to/your/keypair.json
```

### Step 2: Get the Private Key Array

Open your keypair file and you'll see an array of 64 numbers:

```json
[123,45,67,89,12,34,56,78,...]
```

### Step 3: Set the Environment Variable

You have three options for the format:

#### Option 1: Base58 String from Phantom (Easiest! ✅)

If you exported from Phantom wallet, just paste it directly:

**.env.local:**

```bash
NFT_UPDATE_AUTHORITY_PRIVATE_KEY="5Kb8iW7QNmVmH3LqKxYz9fV3J2pXH8dK7CqWx5..."
```

**Important:**

- Should be ~88 characters long
- No brackets or commas
- Just the base58 string wrapped in quotes

#### Option 2: JSON Array

Copy the entire array from your keypair file:

**.env.local:**

```bash
NFT_UPDATE_AUTHORITY_PRIVATE_KEY="[123,45,67,89,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56]"
```

**Important:** Make sure it's wrapped in quotes and has no extra whitespace.

#### Option 3: Comma-Separated

Remove the brackets from the array:

**.env.local:**

```bash
NFT_UPDATE_AUTHORITY_PRIVATE_KEY="123,45,67,89,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56"
```

### Step 4: Quick Command to Copy

Use this command to copy your keypair to clipboard:

**On macOS:**

```bash
cat ~/.config/solana/id.json | pbcopy
```

**On Linux:**

```bash
cat ~/.config/solana/id.json | xclip -selection clipboard
```

**On Windows (PowerShell):**

```powershell
Get-Content ~/.config/solana/id.json | Set-Clipboard
```

### Step 5: Verify the Format

Your private key array should:

- ✅ Have exactly **64 numbers**
- ✅ Be wrapped in **quotes** in the .env file
- ✅ Have **no extra whitespace** before or after
- ✅ Be a valid JSON array `[...]` or comma-separated values

### Step 6: Test Your Setup

After setting the environment variable, restart your development server:

```bash
# Stop the server (Ctrl+C)

# Restart
yarn dev
```

Then try to reveal an NFT. You should see in the logs:

```
Update authority loaded: <your-public-key>
```

## Common Issues

### Issue 1: "Unexpected non-whitespace character"

**Cause:** Extra characters before the JSON array
**Fix:** Make sure there's no whitespace or characters before the `[`

❌ Wrong:

```bash
NFT_UPDATE_AUTHORITY_PRIVATE_KEY=" [123,45,..."
```

✅ Correct:

```bash
NFT_UPDATE_AUTHORITY_PRIVATE_KEY="[123,45,..."
```

### Issue 2: "Invalid secret key length"

**Cause:** Array doesn't have exactly 64 numbers
**Fix:** Make sure you copied the entire array from your keypair file

### Issue 3: "Update authority mismatch"

**Cause:** The keypair doesn't have update authority over your NFTs
**Fix:** Use the keypair that was set as the update authority when minting the NFTs

## Security Best Practices

⚠️ **CRITICAL SECURITY WARNINGS:**

1. **NEVER commit `.env.local` to git**
   - Add it to `.gitignore` (should already be there)
2. **NEVER share your private key**
   - This gives full control over your NFT collection
3. **Use environment-specific keys**
   - Different keys for development and production
4. **Rotate keys if exposed**
   - If you accidentally expose your key, create a new keypair immediately
   - Transfer update authority to the new keypair

## Production Deployment

For production (e.g., Vercel, Netlify):

1. Go to your hosting platform's environment variables settings
2. Add the variable:
   - Name: `NFT_UPDATE_AUTHORITY_PRIVATE_KEY`
   - Value: Your keypair array (as JSON or comma-separated)
3. Redeploy your application

### Vercel Example:

```
Project Settings → Environment Variables → Add New
Name: NFT_UPDATE_AUTHORITY_PRIVATE_KEY
Value: [123,45,67,...]
```

## Verification Checklist

Before testing, verify:

- [ ] Environment variable is set in `.env.local`
- [ ] Format is either `[1,2,3,...]` or `1,2,3,...`
- [ ] Array has exactly 64 numbers
- [ ] No extra whitespace or characters
- [ ] Development server has been restarted
- [ ] `.env.local` is in `.gitignore`

## Getting Your Public Key

To verify which public key corresponds to your private key:

```bash
solana-keygen pubkey ~/.config/solana/id.json
```

This should match the update authority of your NFTs.

## Checking Update Authority on an NFT

To verify the update authority of your NFT:

```bash
# Using Solana CLI
solana account <NFT_MINT_ADDRESS> --output json

# Or check on Solana Explorer
# https://explorer.solana.com/address/<NFT_MINT_ADDRESS>
```

The update authority should match your keypair's public key.

## Need Help?

If you're still getting errors:

1. Check the server logs for detailed error messages
2. Verify your keypair file exists and is readable
3. Ensure you have the correct update authority
4. Test with the Solana CLI first:
   ```bash
   solana-keygen verify <public-key> ~/.config/solana/id.json
   ```

## Example Complete .env.local

```bash
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"

# NFT Update Authority (64-byte array from keypair file)
NFT_UPDATE_AUTHORITY_PRIVATE_KEY="[123,45,67,89,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56]"

# NFT Collection Address (optional - enables faster fetching by filtering to specific collection)
NEXT_PUBLIC_NFT_COLLECTION_ADDRESS="<your-collection-public-key>"

# Metadata Base URL
NEXT_PUBLIC_METADATA_BASE_URL="https://vault7641.com"
```

**Note about NEXT_PUBLIC_NFT_COLLECTION_ADDRESS:**

- This is **optional but highly recommended** - enables faster NFT fetching using DAS API collection filtering
- Without this, the app will fetch ALL NFTs from the wallet (slower)
- With this, the app only fetches NFTs from your specific Vault 7641 collection (much faster)
- If your NFTs are not in a collection, you can omit this variable

Remember: Keep this file secret and never commit it to version control! 🔒
