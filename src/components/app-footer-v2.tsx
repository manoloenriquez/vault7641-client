import React from 'react'
import Link from 'next/link'

export function AppFooterV2() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-800 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-white">VAULT 7641</h3>
            <p className="text-sm text-zinc-400 mb-6 max-w-md leading-relaxed">
              This is a digital membership collectible that grants access to community content and perks. It is not an
              investment, security, or deposit product. No profit-sharing, yield, or price promises. NFTs are
              non-refundable. Nothing here is financial advice.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
                🐦 Twitter
              </a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
                📊 Discord
              </a>
            </div>
          </div>

          {/* Official Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">OFFICIAL</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/safety" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  /safety
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  /status
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  /press
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">LEGAL</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  /terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  /privacy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  /disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <div className="text-sm text-zinc-500">© {currentYear} Vault 7641. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
