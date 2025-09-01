import { AuthGuard } from '@/components/auth/auth-guard'
import { MemberDashboard } from '@/components/vault/member-dashboard'

export default function DashboardPage() {
  return (
    <AuthGuard requiresNFT={true}>
      <MemberDashboard />
    </AuthGuard>
  )
}
