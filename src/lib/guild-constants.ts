/**
 * Guild Configuration and Constants
 * 
 * Centralized guild data to ensure consistency across the application.
 * Used in guild selection, reveal flow, and UI components.
 */

export type GuildType = 'builder' | 'trader' | 'farmer' | 'gamer' | 'pathfinder'

export interface Guild {
  id: GuildType
  name: string
  description: string
  gradient: string
  color: string
  benefits: string[]
}

/**
 * All available guilds with their configurations
 */
export const GUILDS: Guild[] = [
  {
    id: 'builder',
    name: 'Builder Guild',
    description:
      'For Web3 engineers, designers, data researchers, automators, founders, product designers, anyone who builds & ships.',
    gradient: 'from-yellow-300 via-yellow-500 to-yellow-800',
    color: 'bg-yellow-500',
    benefits: [
      'Forum board',
      'Build Logs',
      'Code/Design Reviews',
      'RFC (Request for Comments) lane',
      'Advanced learning resources',
      'Direct mentor & expert chats + AMAs',
      'Partner perks',
      'Live sessions + recaps',
    ],
  },
  {
    id: 'trader',
    name: 'Trader Guild',
    description:
      'For new and experienced traders & investors who want structured, real market insights, clear setups & opportunities.',
    gradient: 'from-orange-400 via-orange-600 to-red-700',
    color: 'bg-orange-500',
    benefits: [
      'Exclusive Market Insights & Signals',
      'Actionable Trade Setups',
      'Market Watch & News',
      'On-Chain Data & Reports',
      'Community Coaching & Feedback',
      'Market Outlook Newsletters',
      'Whale Watch',
      'Private Research',
    ],
  },
  {
    id: 'farmer',
    name: 'Farmer Guild',
    description: 'For DeFi participants, airdrop hunters, points farmers, and yield strategists.',
    gradient: 'from-lime-600 via-green-900 to-green-600',
    color: 'bg-green-500',
    benefits: [
      'Alerts & Routes',
      'Walkthroughs',
      'Points Meta',
      'Risk Desk',
      'Cohorts',
      'Advanced resources',
      'Mentor rooms with seasoned farmers',
      'Access exclusive guild chat',
    ],
  },
  {
    id: 'gamer',
    name: 'Gamer Guild',
    description: 'For P2E gamers, NFT collectors, flippers, and enjoyers of game economies.',
    gradient: 'from-fuchsia-600 via-violet-900 to-fuchsia-900',
    color: 'bg-fuchsia-500',
    benefits: [
      'Mints Today & Exclusive Alpha',
      'Game Nights & Playtests',
      'Flip Desk',
      'Economy Watch',
      'Creator Corner',
      'Advanced resources',
      'Mentor rooms with creators and experts',
      'Access exclusive guild chat',
    ],
  },
  {
    id: 'pathfinder',
    name: 'Pathfinder Guild',
    description:
      'For Marketers, CMs, devs, analysts, designers, students, unemployed, and professionals who want Web3 careers.',
    gradient: 'from-cyan-600 via-teal-400 to-cyan-500',
    color: 'bg-cyan-500',
    benefits: [
      'Curated Job Board',
      'Bounties & Paid Tasks',
      'Application Sprints',
      'Résumé/CV & Portfolio Reviews',
      'Mock Interviews',
      'Referral Network',
      'Proof-of-Work Threads',
      'Opportunity Radar',
    ],
  },
]

/**
 * Get guild by ID
 */
export function getGuildById(guildId: string): Guild | undefined {
  return GUILDS.find((guild) => guild.id === guildId)
}

/**
 * Validate if a string is a valid guild ID
 */
export function isValidGuildId(guildId: string): guildId is GuildType {
  return GUILDS.some((guild) => guild.id === guildId)
}

/**
 * All valid guild IDs
 */
export const VALID_GUILD_IDS: GuildType[] = GUILDS.map((guild) => guild.id)

