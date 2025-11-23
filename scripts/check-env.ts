#!/usr/bin/env tsx
/**
 * Environment Variables Checker
 * 
 * Verifies all required environment variables are set for the regeneration system.
 * Run with: npx tsx scripts/check-env.ts
 */

const REQUIRED_VARS = {
  // Supabase
  SUPABASE_URL: {
    required: true,
    description: 'Supabase project URL',
    example: 'https://xxxxx.supabase.co',
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    required: true,
    description: 'Supabase service role key (for server-side storage access)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    note: 'Must be service role key, not anon key',
  },
  SUPABASE_TRAITS_BUCKET: {
    required: false,
    description: 'Supabase storage bucket name for traits',
    default: 'traits',
    example: 'traits',
  },
  
  // Solana
  SOLANA_RPC_URL: {
    required: true,
    description: 'Solana RPC endpoint URL',
    example: 'https://api.mainnet-beta.solana.com',
    note: 'Or use NEXT_PUBLIC_SOLANA_RPC_URL for client-side',
  },
  NEXT_PUBLIC_SOLANA_RPC_URL: {
    required: false,
    description: 'Public Solana RPC URL (for client-side)',
    example: 'https://api.mainnet-beta.solana.com',
  },
  
  // Update Authority
  NFT_UPDATE_AUTHORITY_PRIVATE_KEY: {
    required: true,
    description: 'Private key for NFT update authority (base58 format)',
    example: '5Kb8...xyz',
    note: 'Supports base58, JSON array, or comma-separated formats',
  },
  ADMIN_KEYPAIR_JSON: {
    required: false,
    description: 'Alternative: Admin keypair as JSON array',
    example: '[1,2,3,...,64]',
    note: 'Can be used instead of NFT_UPDATE_AUTHORITY_PRIVATE_KEY',
  },
  
  // Optional
  NEXT_PUBLIC_NFT_COLLECTION_ADDRESS: {
    required: false,
    description: 'NFT collection address for filtering',
    example: 'So11111111111111111111111111111111111111112',
  },
  NEXT_PUBLIC_METADATA_BASE_URL: {
    required: false,
    description: 'Base URL for metadata JSON files',
    example: 'https://gateway.lighthouse.storage/ipfs/...',
  },
} as const

interface CheckResult {
  name: string
  status: 'ok' | 'missing' | 'warning'
  value?: string
  message: string
}

function checkEnvVar(name: string, config: typeof REQUIRED_VARS[keyof typeof REQUIRED_VARS]): CheckResult {
  const value = process.env[name]
  const isSet = value !== undefined && value.trim() !== ''
  
  if (!isSet) {
    if (config.required) {
      return {
        name,
        status: 'missing',
        message: `❌ MISSING (required): ${config.description}`,
      }
    } else {
      const defaultMsg = config.default ? ` (defaults to: ${config.default})` : ''
      return {
        name,
        status: 'warning',
        message: `⚠️  NOT SET (optional)${defaultMsg}: ${config.description}`,
      }
    }
  }
  
  // Validate format for specific vars
  let validationMessage = ''
  if (name === 'SUPABASE_URL' && !value.startsWith('https://')) {
    validationMessage = ' ⚠️  Warning: Should start with https://'
  }
  if (name === 'SUPABASE_SERVICE_ROLE_KEY' && value.startsWith('eyJ')) {
    validationMessage = ' ✅ Looks like a valid JWT'
  }
  if ((name === 'NFT_UPDATE_AUTHORITY_PRIVATE_KEY' || name === 'ADMIN_KEYPAIR_JSON') && value) {
    try {
      if (value.startsWith('[')) {
        JSON.parse(value)
        validationMessage = ' ✅ Valid JSON array format'
      } else if (value.includes(',')) {
        const parts = value.split(',').map(n => parseInt(n.trim(), 10))
        if (parts.length === 64 && parts.every(n => !isNaN(n))) {
          validationMessage = ' ✅ Valid comma-separated format'
        }
      } else if (value.length === 88) {
        validationMessage = ' ✅ Looks like base58 format'
      }
    } catch {
      validationMessage = ' ⚠️  Format validation failed'
    }
  }
  
  const maskedValue = value.length > 20 ? `${value.slice(0, 10)}...${value.slice(-4)}` : '***'
  
  return {
    name,
    status: 'ok',
    value: maskedValue,
    message: `✅ SET: ${config.description}${validationMessage}`,
  }
}

function main() {
  console.log('🔍 Checking Environment Variables\n')
  console.log('=' .repeat(60))
  
  const results: CheckResult[] = []
  let hasErrors = false
  
  for (const [name, config] of Object.entries(REQUIRED_VARS)) {
    const result = checkEnvVar(name, config)
    results.push(result)
    
    if (result.status === 'missing') {
      hasErrors = true
    }
    
    console.log(`\n${result.message}`)
    if (result.value) {
      console.log(`   Value: ${result.value}`)
    }
    if (config.example) {
      console.log(`   Example: ${config.example}`)
    }
    if (config.note) {
      console.log(`   Note: ${config.note}`)
    }
  }
  
  console.log('\n' + '='.repeat(60))
  
  // Summary
  const okCount = results.filter(r => r.status === 'ok').length
  const missingCount = results.filter(r => r.status === 'missing').length
  const warningCount = results.filter(r => r.status === 'warning').length
  
  console.log('\n📊 Summary:')
  console.log(`   ✅ Set: ${okCount}`)
  console.log(`   ❌ Missing (required): ${missingCount}`)
  console.log(`   ⚠️  Warnings (optional): ${warningCount}`)
  
  if (hasErrors) {
    console.log('\n❌ Some required environment variables are missing!')
    console.log('   Please set them in your .env.local file or deployment environment.')
    process.exit(1)
  } else {
    console.log('\n✅ All required environment variables are set!')
    
    // Additional checks
    console.log('\n🔧 Additional Checks:')
    
    // Check Supabase connection
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('   Testing Supabase connection...')
      // Could add actual connection test here
      console.log('   ⚠️  Connection test not implemented (add if needed)')
    }
    
    // Check Solana connection
    if (process.env.SOLANA_RPC_URL || process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      console.log('   ✅ Solana RPC URL configured')
    }
    
    console.log('\n✨ Environment check complete!')
  }
}

main()

