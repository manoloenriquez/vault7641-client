# Quick Setup for Phantom Wallet Users

If you're using a Phantom wallet private key, this is the quickest way to get set up!

## Step 1: Export Your Private Key from Phantom

1. Open your Phantom wallet browser extension
2. Click the **Settings** icon (gear) at the bottom
3. Click **Security & Privacy**
4. Click **Show Private Key** or **Export Private Key**
5. Confirm with your password
6. **Copy the private key** - it looks like: `5Kb8iW7QNmVmH3LqKxYz9fV3...` (base58 string, ~88 characters)

⚠️ **NEVER share this key with anyone!**

## Step 2: Add to Your .env.local File

Create or open `.env.local` in your project root and add:

```bash
NFT_UPDATE_AUTHORITY_PRIVATE_KEY="5Kb8iW7QNmVmH3LqKxYz9fV3J2pXH8dK7CqWx5..."
```

**Replace** `5Kb8iW7QNmVmH3LqKxYz9fV3J2pXH8dK7CqWx5...` with your actual private key from step 1.

**Important:**

- ✅ Wrap the key in quotes
- ✅ No brackets `[]`
- ✅ No commas
- ✅ Just the base58 string from Phantom

## Step 3: Restart Your Dev Server

Stop your development server (Ctrl+C) and restart it:

```bash
yarn dev
```

## Step 4: Test It

Try to reveal an NFT. In the logs you should see:

```
Parsing private key...
Format detected: Base58 string
Decoded base58, length: 64
✅ Successfully loaded keypair
Update authority loaded: <your-public-key>
```

## That's It! 🎉

Your Phantom wallet private key is now configured and ready to update NFT metadata!

---

## Security Checklist

Before you continue, make sure:

- [ ] `.env.local` is in your `.gitignore` (it should be by default)
- [ ] You haven't committed `.env.local` to git
- [ ] You haven't shared your private key with anyone
- [ ] You're using the correct wallet that has update authority over your NFTs

---

## Troubleshooting

### "Invalid secret key length"

- Make sure you copied the **entire** private key from Phantom
- Should be ~88 characters long
- No spaces or line breaks

### "Update authority mismatch"

- The wallet you exported must be the one that has update authority over your NFTs
- Check on Solana Explorer: the NFT's update authority should match your wallet's public key

### "Format detected: Comma-separated" or "JSON array"

- You might have extra characters or formatting issues
- Make sure the key is just the base58 string with quotes, nothing else:
  ```bash
  NFT_UPDATE_AUTHORITY_PRIVATE_KEY="5Kb8..."
  ```

---

## Example Complete .env.local

```bash
# Solana RPC
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"

# Your Phantom wallet private key (base58 format)
NFT_UPDATE_AUTHORITY_PRIVATE_KEY="5Kb8iW7QNmVmH3LqKxYz9fV3J2pXH8dK7CqWx5pL4mN6oP7qR8sT9uV0wX1yZ2"

# NFT Collection Address (optional - enables faster fetching by filtering to specific collection)
NEXT_PUBLIC_NFT_COLLECTION_ADDRESS="<your-collection-public-key>"

# Metadata base URL
NEXT_PUBLIC_METADATA_BASE_URL="https://vault7641.com"
```

**Note about NEXT_PUBLIC_NFT_COLLECTION_ADDRESS:**

- This is **optional but recommended** - enables faster NFT fetching using DAS API collection filtering
- Without this, the app will fetch ALL NFTs from the wallet (slower)
- With this, only your Vault 7641 collection NFTs are fetched (much faster)
- If your NFTs are not in a collection, you can skip this variable

Remember to replace the example key with your actual private key! 🔑
