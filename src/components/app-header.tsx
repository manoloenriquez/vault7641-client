'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { WalletButton } from '@/components/solana/solana-provider'

const navigationLinks = [
  { label: 'How it works', path: '#how-it-works' },
  { label: 'Guilds', path: '#guilds' },
  { label: 'FAQ', path: '#faq' },
]

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  const handleNavClick = (path: string) => {
    setShowMenu(false)
    if (path.startsWith('#')) {
      const element = document.querySelector(path)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 px-4 py-3 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/50' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link className="text-2xl font-bold hover:text-primary transition-colors" href="/">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Vault 7641</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {navigationLinks.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => handleNavClick(path)}
                className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
              >
                {label}
              </button>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-sm">
              Claim WL
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              Join Discord
            </Button>
            <WalletButton size="sm" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden fixed inset-x-0 top-[70px] bottom-0 bg-background/95 backdrop-blur-sm">
            <div className="flex flex-col p-6 gap-6 border-t border-border/50">
              {/* Navigation */}
              <nav className="flex flex-col gap-4">
                {navigationLinks.map(({ label, path }) => (
                  <button
                    key={path}
                    onClick={() => handleNavClick(path)}
                    className="text-left text-lg py-2 hover:text-primary transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </nav>

              {/* Mobile CTAs */}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Mint Pass
                </Button>
                <Button variant="outline">Claim WL</Button>
                <Button variant="outline">Join Discord</Button>
                <WalletButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
