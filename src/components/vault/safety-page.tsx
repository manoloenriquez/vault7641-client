'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
import { Shield, ExternalLink, AlertTriangle, CheckCircle, Copy, MessageCircle } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/constants'

const officialLinks = [
  {
    platform: 'Website',
    url: 'https://vault7641.com',
    verified: true,
    description: 'Official website and mint portal',
  },
  {
    platform: 'Discord',
    url: SOCIAL_LINKS.discord,
    verified: true,
    description: 'Official community server',
  },
  {
    platform: 'Twitter',
    url: 'https://x.com/vault7641',
    verified: true,
    description: 'Official announcements and updates',
  },
]
const safetyChecklist = [
  {
    category: 'Official Communications',
    items: [
      'Staff will NEVER DM you first',
      'All official announcements come from verified accounts only',
      'We will never ask for your seed phrase or private keys',
      'No surprise giveaways or urgent time-sensitive offers',
    ],
  },
  {
    category: 'Website Security',
    items: [
      'Always check the URL is exactly vault7641.com',
      'Look for the SSL lock icon in your browser',
      'Bookmark our official site to avoid typos',
      'Never enter wallet info on suspicious sites',
    ],
  },
  {
    category: 'Discord Safety',
    items: [
      'Join only through our official website link',
      'Check for the verified server badge',
      'Report any suspicious DMs immediately',
      'Never share personal info in public channels',
    ],
  },
  {
    category: 'Wallet Protection',
    items: [
      'Use a hardware wallet when possible',
      'Never share your seed phrase with anyone',
      'Double-check all transaction details before signing',
      'Keep your wallet software updated',
    ],
  },
]

export function SafetyPage() {
  const [reportForm, setReportForm] = useState({
    type: '',
    description: '',
    url: '',
    evidence: '',
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle report submission
    console.log('Report submitted:', reportForm)
    alert('Thank you for your report! Our security team will investigate.')
    setReportForm({ type: '', description: '', url: '', evidence: '' })
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">Safety First</h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Protect yourself from scams and fraudulent activities. Always verify official links and report suspicious
              behavior to keep our community safe.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Official Links */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Official Links</h2>
              <div className="space-y-4">
                {officialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-bold">{link.platform}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">{link.url}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(link.url)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{link.description}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        Visit
                        <ExternalLink className="ml-2 w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Anti-Phishing Checklist */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Anti-Phishing Checklist</h2>
              <div className="space-y-6">
                {safetyChecklist.map((category, index) => (
                  <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 text-primary">{category.category}</h3>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Form */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-red-500/5 via-orange-500/5 to-red-500/5 border border-red-500/20 rounded-2xl p-8 flex flex-col">
              <div className="text-center mb-8">
                <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">Report a Scam</h2>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                  Help protect the community by reporting suspicious activities, fake accounts, or fraudulent websites.
                  Every report helps keep everyone safe.
                </p>
              </div>

              {/* <form onSubmit={handleReportSubmit} className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Type of Scam</label>
                  <select
                    value={reportForm.type}
                    onChange={(e) => setReportForm((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 bg-card border border-border/50 rounded-xl"
                    required
                  >
                    <option value="">Select scam type</option>
                    <option value="fake-website">Fake Website</option>
                    <option value="discord-impersonation">Discord Impersonation</option>
                    <option value="social-media-fraud">Social Media Fraud</option>
                    <option value="phishing-dm">Phishing DM</option>
                    <option value="fake-giveaway">Fake Giveaway</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Suspicious URL or Account</label>
                  <Input
                    value={reportForm.url}
                    onChange={(e) => setReportForm((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://fake-site.com or @fake-account"
                    className="bg-card border-border/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={reportForm.description}
                    onChange={(e) => setReportForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what happened and how you encountered this scam..."
                    rows={4}
                    className="w-full px-4 py-3 bg-card border border-border/50 rounded-xl resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Evidence (Optional)</label>
                  <textarea
                    value={reportForm.evidence}
                    onChange={(e) => setReportForm((prev) => ({ ...prev, evidence: e.target.value }))}
                    placeholder="Screenshots, messages, or other evidence (describe or paste text)"
                    rows={3}
                    className="w-full px-4 py-3 bg-card border border-border/50 rounded-xl resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    Submit Report
                  </Button>
                  <Button type="button" variant="outline" size="lg" asChild>
                    <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer">
                      Report in Discord
                      <MessageCircle className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </form> */}
              <Button type="button" variant="outline" size="lg" asChild className="mx-auto mt-4">
                <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer">
                  Report in Discord
                  <MessageCircle className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </section>

          {/* Emergency Contact */}
          {/* <div className="text-center">
            <div className="bg-card/30 border border-border/50 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-4">Emergency Security Contact</h3>
              <p className="text-sm text-zinc-400 mb-4">
                For urgent security threats or if you&apos;ve been compromised, contact our security team immediately:
              </p>
              <div className="flex items-center justify-center gap-4">
                <code className="bg-muted px-3 py-2 rounded-lg text-sm">security@vault7641.com</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard('security@vault7641.com')}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
