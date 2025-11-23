import sharp, { OverlayOptions } from 'sharp'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const CANVAS_WIDTH = 2048
const CANVAS_HEIGHT = 2048
const TRAITS_BUCKET = process.env.SUPABASE_TRAITS_BUCKET ?? 'traits'

const TRAIT_DIRECTORIES = [
  '01-Guild Backgrounds',
  '02-Body',
  '03-Mouth',
  '04-Eyes',
  '05-Outfits',
  '06-Hair',
  '07-Headwear',
  '08-Hand',
  '09-Hand Gear',
] as const

const BACKGROUND_IDX = 0
const BODY_IDX = 1
const HAIR_IDX = 5
const HEADWEAR_IDX = 6
const HAND_IDX = 7

const SUPPORTED_GUILDS = ['Builder Guild', 'Farmer Guild', 'Gamer Guild', 'Pathfinder Guild', 'Trader Guild'] as const
const GENDERS = ['Male', 'Female'] as const

const GUILD_SPECIFIC_TRAITS = new Set(['05-Outfits', '07-Headwear', '09-Hand Gear'])
const GENDER_SPECIFIC_TRAITS = new Set(['02-Body', '03-Mouth', '04-Eyes', '05-Outfits', '06-Hair', '07-Headwear', '08-Hand'])

const BUZZ_CUT_ONLY_HEADWEAR: Record<string, string[]> = {
  'Builder Guild': ['Welding Mask'],
  'Trader Guild': ['Bull Mask', 'Bear Mask', 'Astronaut Helmet'],
  'Farmer Guild': ['Straw Hat', 'Farmer Cap', 'Trapper Hat'],
  'Gamer Guild': ['Gamer Cap'],
  'Pathfinder Guild': ['Explorer Compass Hat', 'Headlamp'],
  General: [],
}

type Guild = (typeof SUPPORTED_GUILDS)[number]
type Gender = (typeof GENDERS)[number]

export type NftImageGenerationOptions = {
  guild?: Guild | string
  gender?: Gender | string
  seed?: number
}

const traitListCache = new Map<string, string[]>()

const supabaseClient = getSupabaseServerClient()

function normalizeGuild(guild?: string | null): Guild | 'General' {
  if (!guild) {
    return 'Builder Guild'
  }

  const match = SUPPORTED_GUILDS.find((g) => g.toLowerCase() === guild.toLowerCase())
  return match ?? 'General'
}

function normalizeGender(gender?: string | null): Gender {
  if (!gender) {
    return 'Male'
  }

  const match = GENDERS.find((g) => g.toLowerCase() === gender.toLowerCase())
  return match ?? 'Male'
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

async function listTraitFiles(path: string): Promise<string[]> {
  if (traitListCache.has(path)) {
    return traitListCache.get(path) ?? []
  }

  const { data, error } = await supabaseClient.storage.from(TRAITS_BUCKET).list(path, {
    limit: 1000,
    sortBy: { column: 'name', order: 'asc' },
  })

  if (error) {
    console.error(`[traits] Failed to list ${path}`, error)
    traitListCache.set(path, [])
    return []
  }

  const files = (data ?? [])
    .filter((item) => item.name && item.metadata && item.metadata.size)
    .map((item) => item.name)

  traitListCache.set(path, files)
  return files
}

async function downloadLayer(path: string): Promise<OverlayOptions | null> {
  try {
    const { data, error } = await supabaseClient.storage.from(TRAITS_BUCKET).download(path)
    if (error || !data) {
      console.warn(`[traits] Missing layer ${path}`, error)
      return null
    }
    const buffer = Buffer.from(await data.arrayBuffer())
    return { input: buffer, blend: 'over' }
  } catch (error) {
    console.error(`[traits] Error downloading ${path}`, error)
    return null
  }
}

function parseWeight(filename: string): number {
  const [prefix] = filename.split('_')
  const weight = Number(prefix)
  return Number.isFinite(weight) ? weight : 1
}

function extractTraitName(filename: string): string {
  const withoutExt = filename.replace(/\.png$/i, '')
  const parts = withoutExt.split('_')
  if (parts.length >= 3) {
    return parts.slice(1, -1).join('_')
  }
  return parts.slice(1).join('_') || withoutExt
}

function extractSkinTone(filename: string): string | null {
  const parts = filename.split('_')
  if (parts.length >= 2) {
    return parts[1].replace(/ Skin/i, '').trim()
  }
  return null
}

function pickWeighted<T>(items: T[], weights: number[], random: () => number): T {
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  let threshold = random() * total
  for (let i = 0; i < items.length; i += 1) {
    threshold -= weights[i]
    if (threshold <= 0) {
      return items[i]
    }
  }
  return items[items.length - 1]
}

async function selectFileFromDirectory(
  traitDir: string,
  subPath: string,
  gender: Gender,
  random: () => number,
): Promise<string | null> {
  const files = await listTraitFiles(subPath ? `${traitDir}/${subPath}` : traitDir)
  if (!files.length) {
    return null
  }

  const filtered = GENDER_SPECIFIC_TRAITS.has(traitDir)
    ? files.filter((file) => file.toLowerCase().endsWith(`_${gender.toLowerCase()}.png`))
    : files

  if (!filtered.length) {
    return null
  }

  const weights = filtered.map(parseWeight)
  return pickWeighted(filtered, weights, random)
}

async function selectGuildAwareTrait(
  traitDir: string,
  guild: Guild | 'General',
  gender: Gender,
  random: () => number,
): Promise<{ filename: string; path: string } | null> {
  const useGuildSpecific = random() < 0.75
  const guildFolder = useGuildSpecific ? (guild === 'General' ? 'General' : guild) : 'General'

  const selection = await selectFileFromDirectory(traitDir, guildFolder, gender, random)
  if (selection) {
    return { filename: selection, path: `${traitDir}/${guildFolder}/${selection}` }
  }

  if (guildFolder !== 'General') {
    const fallback = await selectFileFromDirectory(traitDir, 'General', gender, random)
    if (fallback) {
      return { filename: fallback, path: `${traitDir}/General/${fallback}` }
    }
  }

  return null
}

function isBuzzCut(filename: string): boolean {
  return /buzz cut/i.test(filename)
}

function isBuzzCutExclusive(traitName: string, guild: Guild | 'General'): boolean {
  const exclusives = BUZZ_CUT_ONLY_HEADWEAR[guild] ?? BUZZ_CUT_ONLY_HEADWEAR.General
  return exclusives.some((name) => name.toLowerCase() === traitName.toLowerCase())
}

async function listHeadwearFiles(traitDir: string, folder: string, gender: Gender) {
  const files = await listTraitFiles(`${traitDir}/${folder}`)
  return GENDER_SPECIFIC_TRAITS.has(traitDir)
    ? files.filter((file) => file.toLowerCase().endsWith(`_${gender.toLowerCase()}.png`))
    : files
}

async function getValidHeadwear(
  traitDir: string,
  guild: Guild | 'General',
  gender: Gender,
  hasBuzzCut: boolean,
  random: () => number,
): Promise<{ filename: string; path: string } | null> {
  const primaryFolder = guild === 'General' ? 'General' : guild
  let folderInUse = primaryFolder
  let files = await listHeadwearFiles(traitDir, primaryFolder, gender)

  if (!files.length && primaryFolder !== 'General') {
    files = await listHeadwearFiles(traitDir, 'General', gender)
    folderInUse = 'General'
  }

  if (!files.length) {
    return null
  }

  let usable = files.filter((file) => {
    const traitName = extractTraitName(file)
    const exclusive = isBuzzCutExclusive(traitName, folderInUse)
    if (exclusive) {
      return hasBuzzCut
    }
    return !hasBuzzCut
  })

  if (!usable.length && folderInUse !== 'General') {
    folderInUse = 'General'
    const generalFiles = await listHeadwearFiles(traitDir, 'General', gender)
    usable = generalFiles.filter((file) => {
      const traitName = extractTraitName(file)
      const exclusive = isBuzzCutExclusive(traitName, 'General')
      return exclusive ? hasBuzzCut : !hasBuzzCut
    })
  }

  if (!usable.length) {
    return null
  }

  const weights = usable.map(parseWeight)
  const filename = pickWeighted(usable, weights, random)
  return { filename, path: `${traitDir}/${folderInUse}/${filename}` }
}

async function selectHandWithSkinTone(
  gender: Gender,
  skinTone: string | null,
  random: () => number,
): Promise<{ filename: string; path: string } | null> {
  const traitDir = TRAIT_DIRECTORIES[HAND_IDX]
  const files = await listTraitFiles(traitDir)
  if (!files.length) {
    return null
  }

  const gendered = files.filter((file) => file.toLowerCase().endsWith(`_${gender.toLowerCase()}.png`))
  const matching =
    skinTone && gendered.length
      ? gendered.filter((file) => file.toLowerCase().includes(skinTone.toLowerCase()))
      : []

  const pool = matching.length ? matching : gendered
  if (!pool.length) {
    return null
  }

  const weights = pool.map(parseWeight)
  const filename = pickWeighted(pool, weights, random)
  return { filename, path: `${traitDir}/${filename}` }
}

async function buildLayerPaths(tokenId: number, options: NftImageGenerationOptions) {
  const guild = normalizeGuild(options.guild)
  const gender = normalizeGender(options.gender)
  const seed = options.seed ?? Date.now()
  const random = createSeededRandom((tokenId + seed) & 0xffffffff)

  const layers: string[] = []
  let bodySkinTone: string | null = null
  let hasBuzzCut = false

  for (let idx = 0; idx < TRAIT_DIRECTORIES.length; idx += 1) {
    const traitDir = TRAIT_DIRECTORIES[idx]

    if (idx === BACKGROUND_IDX) {
      const backgrounds = await listTraitFiles(traitDir)
      if (!backgrounds.length) {
        continue
      }
      const background =
        backgrounds.find((file) => file.toLowerCase().includes(guild.toLowerCase())) ?? backgrounds[0]
      layers.push(`${traitDir}/${background}`)
      continue
    }

    if (idx === BODY_IDX) {
      const filename = await selectFileFromDirectory(traitDir, '', gender, random)
      if (!filename) {
        continue
      }
      bodySkinTone = extractSkinTone(filename)
      layers.push(`${traitDir}/${filename}`)
      // Insert gender-specific nose at the correct position (between body and mouth)
      // Nose files are stored at the root of the traits bucket, not in a subdirectory
      layers.push(`Nose_${gender}.png`)
      continue
    }

    if (idx === HAIR_IDX) {
      const result = await selectFileFromDirectory(traitDir, '', gender, random)
      if (!result) {
        continue
      }
      hasBuzzCut = isBuzzCut(result)
      layers.push(`${traitDir}/${result}`)
      continue
    }

    if (idx === HEADWEAR_IDX) {
      const shouldUseHeadwear = hasBuzzCut || random() < 0.8
      if (!shouldUseHeadwear) {
        continue
      }

      const headwear = await getValidHeadwear(traitDir, guild, gender, hasBuzzCut, random)
      if (headwear) {
        layers.push(headwear.path)
      }
      continue
    }

    if (idx === HAND_IDX) {
      const hand = await selectHandWithSkinTone(gender, bodySkinTone, random)
      if (hand) {
        layers.push(hand.path)
      }
      continue
    }

    if (GUILD_SPECIFIC_TRAITS.has(traitDir)) {
      const selection = await selectGuildAwareTrait(traitDir, guild, gender, random)
      if (selection) {
        layers.push(selection.path)
      }
      continue
    }

    const filename = await selectFileFromDirectory(traitDir, '', gender, random)
    if (filename) {
      layers.push(`${traitDir}/${filename}`)
    }
  }

  return layers
}

export async function buildImageBufferFromTraits(tokenId: number, options: NftImageGenerationOptions = {}): Promise<Buffer> {
  const fallbackBuffer = await sharp({
    create: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      channels: 4,
      background: { r: 40, g: 40, b: 40, alpha: 1 },
    },
  })
    .png()
    .toBuffer()

  try {
    const layerPaths = await buildLayerPaths(tokenId, options)
    const overlays = (
      await Promise.all(
        layerPaths.map(async (path) => {
          const overlay = await downloadLayer(path)
          return overlay
        }),
      )
    ).filter((layer): layer is OverlayOptions => Boolean(layer))

    if (!overlays.length) {
      return fallbackBuffer
    }

    return sharp({
      create: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(overlays)
      .png()
      .toBuffer()
  } catch (error) {
    console.error('[buildImageBufferFromTraits] Falling back to solid color PNG:', error)
    return fallbackBuffer
  }
}

