import { createHmac, randomBytes } from 'crypto'

const TOKEN_VERSION = 'v1'
const DEFAULT_TTL_MS = 5 * 60 * 1000 // 5 minutes

export type SignedTokenType = 'generation' | 'update'

export interface BaseSignedPayload {
  type: SignedTokenType
  mint: string
  walletAddress: string
  issuedAt: number
  expiresAt: number
}

export interface GenerationSignedPayload extends BaseSignedPayload {
  type: 'generation'
  tokenNumber: number
  guild: string
  gender: string
  seed: string
}

export interface UpdateSignedPayload extends BaseSignedPayload {
  type: 'update'
  metadataUri: string
  newName?: string
}

export type AnySignedPayload = GenerationSignedPayload | UpdateSignedPayload

export interface SignedToken<TPayload extends AnySignedPayload = AnySignedPayload> {
  token: string
  signature: string
  payload: TPayload
}

function getSecret(): string {
  const secret = process.env.API_PARAM_SIGNATURE_SECRET
  if (!secret) {
    throw new Error('API_PARAM_SIGNATURE_SECRET env var is required for signing API parameters')
  }
  return secret
}

export function generateSeed(bytes = 32): string {
  return randomBytes(bytes).toString('hex')
}

export function createSignedToken<TPayload extends AnySignedPayload>(
  payload: Omit<TPayload, 'issuedAt' | 'expiresAt'> & Partial<Pick<TPayload, 'expiresAt'>>,
  ttlMs: number = DEFAULT_TTL_MS,
): SignedToken<TPayload> {
  const issuedAt = Date.now()
  const expiresAt = payload.expiresAt ?? issuedAt + ttlMs
  const payloadWithTimestamps = {
    ...(payload as Omit<TPayload, 'issuedAt' | 'expiresAt'>),
    issuedAt,
    expiresAt,
  } as TPayload

  const normalizedPayload = normalizeValue(payloadWithTimestamps) as TPayload

  const token = encodeToken(normalizedPayload)
  const signature = signPayload(normalizedPayload)

  return {
    token,
    signature,
    payload: normalizedPayload,
  }
}

export function verifySignedToken<TExpected extends AnySignedPayload>(
  token: string | null,
  signature: string | null,
): { valid: boolean; payload?: TExpected; error?: string } {
  if (!token || !signature) {
    return { valid: false, error: 'Missing token or signature' }
  }

  try {
    const decoded = decodeToken<TExpected>(token)
    return verifyPayloadInternal(decoded, signature)
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Failed to verify token',
    }
  }
}

export function verifySignedPayload<TExpected extends AnySignedPayload>(
  payload: TExpected | null | undefined,
  signature: string | null,
): { valid: boolean; payload?: TExpected; error?: string } {
  if (!payload || !signature) {
    return { valid: false, error: 'Missing payload or signature' }
  }
  return verifyPayloadInternal(payload, signature)
}

function encodeToken(payload: AnySignedPayload): string {
  const envelope = JSON.stringify({
    version: TOKEN_VERSION,
    payload,
  })
  return Buffer.from(envelope, 'utf8').toString('base64url')
}

function decodeToken<TPayload extends AnySignedPayload>(token: string): TPayload {
  const json = Buffer.from(token, 'base64url').toString('utf8')
  const parsed = JSON.parse(json) as { version: string; payload: TPayload }

  if (!parsed || parsed.version !== TOKEN_VERSION) {
    throw new Error('Unsupported token version')
  }

  return parsed.payload
}

function signPayload(payload: AnySignedPayload): string {
  const secret = getSecret()
  const canonicalPayload = canonicalize({
    version: TOKEN_VERSION,
    payload,
  })
  return createHmac('sha256', secret).update(canonicalPayload).digest('hex')
}

function canonicalize(value: unknown): string {
  const normalized = normalizeValue(value)
  return JSON.stringify(normalized)
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export function decodeSignedPayload<TPayload extends AnySignedPayload>(token: string): TPayload {
  return decodeToken<TPayload>(token)
}

function verifyPayloadInternal<TExpected extends AnySignedPayload>(
  payload: TExpected,
  signature: string,
): { valid: boolean; payload?: TExpected; error?: string } {
  const normalizedPayload = normalizeValue(payload) as TExpected
  const expectedSignature = signPayload(normalizedPayload)

  if (!timingSafeEqual(signature, expectedSignature)) {
    return { valid: false, error: 'Invalid signature' }
  }

  if (
    typeof (normalizedPayload as AnySignedPayload).expiresAt !== 'number' ||
    Date.now() > normalizedPayload.expiresAt
  ) {
    return { valid: false, error: 'Token expired' }
  }

  return { valid: true, payload: normalizedPayload }
}

function normalizeValue(value: unknown): unknown {
  if (value === undefined) {
    return undefined
  }
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      const normalized = normalizeValue(item)
      return normalized === undefined ? null : normalized
    })
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, val]) => val !== undefined)
    .map(([key, val]) => [key, normalizeValue(val)])
    .filter(([, val]) => val !== undefined)
    .sort(([a], [b]) => (a as string).localeCompare(b as string))

  return Object.fromEntries(entries)
}
