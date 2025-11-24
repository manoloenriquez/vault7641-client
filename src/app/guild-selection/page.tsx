import { GuildSelectionFeature } from '@/components/vault/guild-selection-feature'
import { ErrorBoundary } from '@/components/error-boundary'

export default function GuildSelectionPage() {
  return (
    <ErrorBoundary>
      <GuildSelectionFeature />
    </ErrorBoundary>
  )
}
