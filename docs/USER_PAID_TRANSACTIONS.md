# User-Paid Guild Assignment

This document explains how to implement guild assignment where the **user pays the transaction fee** instead of the server.

## Overview

### Traditional Flow (Server Pays)

```
Client → Server (signs + pays + sends) → Blockchain
```

### New Flow (User Pays)

```
Client → Server (partially signs) → Client (user signs + pays + sends) → Blockchain
```

## Benefits

- ✅ **Lower Server Costs** - Server doesn't pay transaction fees
- ✅ **Better UX** - User sees the transaction in their wallet
- ✅ **More Secure** - Server only has update authority, not SOL
- ✅ **Transparent** - User approves the exact transaction

## Implementation

### 1. API Endpoint

**POST /api/guild/prepare-transaction**

Creates a partially-signed transaction that the client will complete.

**Request:**

```json
{
  "nftMint": "ABC123...",
  "tokenNumber": 1234,
  "guildId": "builder",
  "walletAddress": "USER_WALLET_ADDRESS"
}
```

**Response:**

```json
{
  "success": true,
  "transaction": "BASE64_ENCODED_TRANSACTION",
  "message": "Transaction prepared. User must sign and send.",
  "details": {
    "feePayer": "USER_WALLET_ADDRESS",
    "updateAuthority": "UPDATE_AUTHORITY_ADDRESS",
    "nftMint": "ABC123...",
    "newUri": "https://vault7641.com/metadata/builder/1234.json",
    "blockhash": "...",
    "lastValidBlockHeight": 123456
  }
}
```

### 2. Client Hook

**useGuildAssignmentUserPaid()**

React hook that handles the client-side flow.

**Usage:**

```typescript
import { useGuildAssignmentUserPaid } from '@/hooks/use-guild-assignment-user-paid'

function MyComponent() {
  const { assignGuild, isAssigning } = useGuildAssignmentUserPaid()

  const handleAssign = async () => {
    const signature = await assignGuild(
      'NFT_MINT_ADDRESS',
      1234,  // token number
      'builder'  // guild
    )

    if (signature) {
      console.log('Success! Transaction:', signature)
    }
  }

  return (
    <button onClick={handleAssign} disabled={isAssigning}>
      {isAssigning ? 'Assigning...' : 'Assign Guild'}
    </button>
  )
}
```

## Transaction Flow

### Step-by-Step

1. **Client Requests Transaction**

   ```typescript
   POST / api / guild / prepare - transaction
   ```

2. **Server Creates Partial Transaction**
   - Creates updateV1 instruction
   - Sets user as fee payer
   - Signs with update authority
   - Returns base64 serialized transaction

3. **Client Deserializes Transaction**

   ```typescript
   const tx = Transaction.from(Buffer.from(base64, 'base64'))
   ```

4. **User Signs in Wallet**

   ```typescript
   const signed = await signTransaction(tx)
   ```

   - Phantom/Solflare wallet popup appears
   - User reviews and approves
   - User's signature added

5. **Client Sends Transaction**

   ```typescript
   const sig = await connection.sendRawTransaction(signed.serialize())
   ```

6. **Client Confirms**
   ```typescript
   await connection.confirmTransaction(sig)
   ```

## Security Considerations

### Server Side

- ✅ Server only signs as update authority
- ✅ Server never needs SOL for fees
- ✅ Server private key only used for NFT updates
- ✅ Transaction is validated before signing

### Client Side

- ✅ User sees full transaction details in wallet
- ✅ User explicitly approves transaction
- ✅ User pays from their own wallet
- ✅ Transaction can't be modified after server signs

## Error Handling

### Common Errors

1. **"User rejected the request"**
   - User declined in wallet
   - Solution: Ask user to try again

2. **"Transaction expired"**
   - Blockhash too old
   - Solution: Request new transaction from server

3. **"Insufficient funds"**
   - User doesn't have enough SOL for fee
   - Solution: User needs to add SOL to wallet

4. **"Invalid signatures"**
   - Signature mismatch
   - Solution: Request fresh transaction

## Cost Comparison

### Server-Paid (Old Method)

```
Server pays: ~0.000005 SOL per transaction
1000 users = 0.005 SOL
10,000 users = 0.05 SOL
```

### User-Paid (New Method)

```
Server pays: 0 SOL
Users pay: ~0.000005 SOL each (minimal)
```

## Migration Guide

### From Server-Paid to User-Paid

**Old Code:**

```typescript
// Uses POST /api/guild/assign
const response = await fetch('/api/guild/assign', {
  method: 'POST',
  body: JSON.stringify({ nftMint, tokenNumber, guildId, walletAddress }),
})
```

**New Code:**

```typescript
// Uses new hook
const { assignGuild } = useGuildAssignmentUserPaid()
const signature = await assignGuild(nftMint, tokenNumber, guildId)
```

## Testing

### Test the Flow

1. **Connect wallet** with some SOL (~0.01 SOL for testing)
2. **Call assignGuild()** from your component
3. **Approve transaction** in wallet popup
4. **Check transaction** on Solana Explorer

### Expected Timeline

- Transaction preparation: ~100-300ms
- User approval: Variable (user dependent)
- Transaction confirmation: ~1-2 seconds
- Total: ~2-5 seconds (excluding user think time)

## Troubleshooting

### Issue: Transaction fails immediately

**Check:**

- Does user have enough SOL? (need ~0.00001 SOL)
- Is wallet connected?
- Is update authority configured?

### Issue: Wallet doesn't prompt

**Check:**

- Is `signTransaction` available? (some wallets don't support it)
- Try with Phantom or Solflare wallet
- Check browser console for errors

### Issue: "Invalid blockhash"

**Solution:**

- Blockhash expired (after ~60 seconds)
- Request new transaction from server
- Complete flow faster

## Future Enhancements

### Possible Improvements

1. **Priority Fees** - Allow users to set custom priority fees
2. **Batch Assignments** - Assign multiple NFTs in one transaction
3. **Pre-flight Checks** - Validate before wallet popup
4. **Transaction History** - Track all assignments
5. **Gas Estimation** - Show estimated fee before signing

## Summary

| Aspect           | Server-Paid           | User-Paid              |
| ---------------- | --------------------- | ---------------------- |
| **Server Cost**  | High (pays all fees)  | Zero                   |
| **User Cost**    | Free                  | ~0.000005 SOL          |
| **Security**     | Server needs SOL      | Server only needs key  |
| **UX**           | One-click             | Wallet approval needed |
| **Transparency** | Hidden                | Visible to user        |
| **Scalability**  | Limited by server SOL | Unlimited              |

**Recommendation**: Use user-paid method for production to reduce costs and improve security.
