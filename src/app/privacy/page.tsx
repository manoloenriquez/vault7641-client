export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data We Collect</h2>
            <p className="mb-4">We collect minimal data necessary to provide our services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Wallet Addresses:</strong> For NFT verification and guild assignment
              </li>
              <li>
                <strong>Discord Information:</strong> Username and ID for community verification
              </li>
              <li>
                <strong>Usage Analytics:</strong> Anonymous interaction data for platform improvement
              </li>
              <li>
                <strong>Email Addresses:</strong> Only if voluntarily provided for updates
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Verify NFT ownership and guild membership</li>
              <li>Provide access to community features and content</li>
              <li>Send important updates about the platform (if email provided)</li>
              <li>Improve our services through anonymous usage analytics</li>
              <li>Prevent fraud and maintain platform security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Sharing</h2>
            <p className="mb-4">
              We do not sell or rent your personal information. We may share data only in these cases:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>With Your Consent:</strong> When you explicitly agree to share information
              </li>
              <li>
                <strong>Service Providers:</strong> Third-party services that help us operate (Discord, analytics)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </li>
              <li>
                <strong>Public Blockchain:</strong> NFT transactions are publicly visible on Solana
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cookie Policy</h2>
            <p className="mb-4">We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Essential website functionality</li>
              <li>Analytics and performance monitoring</li>
              <li>Remembering your preferences and settings</li>
            </ul>
            <p className="mt-4">You can control cookie settings through your browser preferences.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Security</h2>
            <p className="mb-4">We implement industry-standard security measures:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and monitoring</li>
              <li>Limited access to personal information</li>
              <li>Secure infrastructure and development practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we have about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of non-essential communications</li>
              <li>Data portability where technically feasible</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">International Transfers</h2>
            <p>
              Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place
              for international data transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for children under 13. We do not knowingly collect personal information from
              children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Changes to Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of material changes through our
              official channels.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-border/50 text-sm text-muted-foreground">
            <p>Last updated: December 2024</p>
            <p>
              For privacy-related questions or to exercise your rights, contact us through our Discord support channel
              or email us at privacy@vault7641.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
