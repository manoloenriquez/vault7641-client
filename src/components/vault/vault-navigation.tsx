'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Shield, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/auth/auth-guard'

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const offset = 120 // Account for fixed navbar height
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  }
}

export function VaultNavigation() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const auth = useAuth()

  return (
    <>
      {/* Safety Header */}
      <div className="fixed inset-x-0 top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-2 text-xs text-zinc-300 flex items-center justify-center gap-3">
          <Shield className="h-4 w-4 text-emerald-400" />
          <span className="font-medium">Safety-First:</span>
          <span>Team never DMs first</span>
          <span>•</span>
          <span>Use official links only</span>
          <span>•</span>
          <Link href="/safety" className="text-emerald-400 hover:text-emerald-300 underline">
            Report scam
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="fixed inset-x-0 top-8 z-40">
        {/* Navigation Bar */}
        <div className="relative z-40 bg-zinc-950/60 backdrop-blur border-b border-zinc-800/50">
          <div className="mx-auto max-w-7xl px-4 py-2 sm:py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/Logo_Full_nobg.png"
                alt="Vault 7641 Logo"
                width={120}
                height={40}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <button
                onClick={() => scrollToSection('guilds')}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Guilds
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection('roadmap')}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Roadmap
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                FAQ
              </button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {auth.hasNFT ? (
                <Link href="/dashboard" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="hidden sm:flex bg-white text-zinc-900 hover:bg-zinc-100 font-semibold"
                    asChild
                  >
                    <a href="https://discord.gg/vault7641" target="_blank" rel="noopener noreferrer">
                      Join Discord
                    </a>
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-zinc-300 p-1.5 bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <div
              className="md:hidden fixed inset-0 top-[104px] bg-black/60 z-30"
              onClick={() => setShowMobileMenu(false)}
            />

            {/* Menu Panel */}
            <div className="md:hidden fixed inset-x-0 top-[104px] bg-zinc-900 border-t border-zinc-800 z-40 animate-in slide-in-from-top duration-300">
              <div className="px-4 py-6 space-y-4 max-w-7xl mx-auto">
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      scrollToSection('guilds')
                      setShowMobileMenu(false)
                    }}
                    className="block text-white hover:text-pink-400 py-3 transition-colors w-full text-left text-lg font-medium active:text-pink-500"
                  >
                    Guilds
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('how-it-works')
                      setShowMobileMenu(false)
                    }}
                    className="block text-white hover:text-pink-400 py-3 transition-colors w-full text-left text-lg font-medium active:text-pink-500"
                  >
                    How it Works
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('roadmap')
                      setShowMobileMenu(false)
                    }}
                    className="block text-white hover:text-pink-400 py-3 transition-colors w-full text-left text-lg font-medium active:text-pink-500"
                  >
                    Roadmap
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('faq')
                      setShowMobileMenu(false)
                    }}
                    className="block text-white hover:text-pink-400 py-3 transition-colors w-full text-left text-lg font-medium active:text-pink-500"
                  >
                    FAQ
                  </button>
                </div>

                <div className="border-t border-zinc-700/50 pt-4 space-y-3">
                  {auth.hasNFT ? (
                    <Link href="/dashboard" onClick={() => setShowMobileMenu(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-base py-6">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button
                        className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-semibold text-base py-6"
                        asChild
                      >
                        <a href="https://discord.gg/vault7641" target="_blank" rel="noopener noreferrer">
                          Join Discord
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
