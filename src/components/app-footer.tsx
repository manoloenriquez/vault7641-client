import React from 'react'
import Link from 'next/link'

export function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card/30 backdrop-blur-sm border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Vault 7641
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your crypto homebase. A curated Web3 community with unlimited education, opportunities, and fun perks.
            </p>
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 text-sm">
              <p className="font-semibold mb-2">Important Disclaimer:</p>
              <p className="text-muted-foreground">
                This is a digital membership collectible that grants access to community content and perks. It is not an
                investment, security, or deposit product.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guilds" className="text-muted-foreground hover:text-foreground transition-colors">
                  Guilds
                </Link>
              </li>
              <li>
                <Link href="/claim" className="text-muted-foreground hover:text-foreground transition-colors">
                  Claim Pass
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} Vault 7641. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Discord
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Medium
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
