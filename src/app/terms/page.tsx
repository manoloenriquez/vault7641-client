export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Important Disclaimer</h2>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-6">
              <p className="text-lg font-semibold mb-4">
                <strong>
                  This is a digital membership collectible that grants access to community content and perks. It is not
                  an investment, security, or deposit product. No profit-sharing, yield, or price promises. NFTs are
                  non-refundable.
                </strong>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Acceptable Use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respectful interaction with community members</li>
              <li>No spam, harassment, or abusive behavior</li>
              <li>No sharing of illegal or inappropriate content</li>
              <li>Compliance with Discord and platform terms of service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Fraud & Abuse Prevention</h2>
            <p className="mb-4">We reserve the right to suspend or terminate access for users who engage in:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Botting or automated minting attempts</li>
              <li>Market manipulation or coordinated attacks</li>
              <li>Sharing access credentials or circumventing security measures</li>
              <li>Any activity that harms the community or platform integrity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Resale & Ownership</h2>
            <p className="mb-4">Base Pass NFTs are tradeable digital collectibles. However:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Guild selection and XP progress are tied to the original minting wallet</li>
              <li>Community benefits may not transfer with resale</li>
              <li>We do not facilitate or endorse any secondary markets</li>
              <li>All sales are final with no refund policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Jurisdiction & Compliance</h2>
            <p className="mb-4">
              This service is provided globally but users must comply with their local laws. We are not available to
              residents of sanctioned jurisdictions.
            </p>
            <p className="mb-4">
              <strong>Philippines Compliance:</strong> We acknowledge the regulatory environment in the Philippines and
              ensure our operations comply with applicable local laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
            <p className="mb-4">Vault 7641 and its operators are not liable for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Market performance of NFTs or any financial losses</li>
              <li>Technical issues, downtime, or access interruptions</li>
              <li>Third-party content, services, or partnerships</li>
              <li>Changes to community structure, benefits, or access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Material changes will be communicated through our
              official channels. Continued use of the service constitutes acceptance of updated terms.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-border/50 text-sm text-muted-foreground">
            <p>Last updated: December 2024</p>
            <p>For questions about these terms, contact us through our Discord support channel.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
