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
          </div>

          {/* Official Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">OFFICIAL</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://x.com/Vault7641"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-cyan-400 transition-colors"
                >
                  /x
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/vault7641"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-cyan-400 transition-colors"
                >
                  /facebook
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">LEGAL</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/v7641 Terms of Service.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-cyan-400 transition-colors"
                >
                  /terms
                </a>
              </li>
              <li>
                <a
                  href="/v7641 Privacy Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-cyan-400 transition-colors"
                >
                  /privacy
                </a>
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
