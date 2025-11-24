import { TraitAttribute } from '@/types/traits'

const DEFAULT_DESCRIPTION =
  'Holding this NFT gives you access to Vault 7641. Inside, members get access to focused classrooms, resources, reports, and opportunities designed to turn knowledge into real skills, better decisions, and long-term outcomes.'
const DEFAULT_SYMBOL = 'V7641'
const DEFAULT_CREATOR_ADDRESS =
  process.env.NEXT_PUBLIC_VAULT_CREATOR_ADDRESS ?? '6KKqACpnaftW9R1VroQGnsssoRkQYEtR7Ut5U8Jf4FiM'

type BuildVaultMetadataOptions = {
  tokenNumber: number
  imageUri: string
  attributes: TraitAttribute[]
  edition?: number
  description?: string
  symbol?: string
  creatorAddress?: string
}

export function buildVaultMetadata({
  tokenNumber,
  imageUri,
  attributes,
  edition = tokenNumber,
  description = DEFAULT_DESCRIPTION,
  symbol = DEFAULT_SYMBOL,
  creatorAddress = DEFAULT_CREATOR_ADDRESS,
}: BuildVaultMetadataOptions) {
  return {
    name: `Vault #${tokenNumber}`,
    symbol,
    description,
    edition,
    image: imageUri,
    attributes,
    properties: {
      files: [{ uri: imageUri, type: 'image/png' }],
      category: 'image',
      creators: [
        {
          address: creatorAddress,
          share: 100,
        },
      ],
    },
  }
}
