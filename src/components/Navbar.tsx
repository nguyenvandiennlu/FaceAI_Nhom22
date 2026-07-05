import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Glasses, ArrowUpRight, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Models',       href: '#models' },
  { label: 'Pipeline',     href: '#pipeline' },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-[background,border-color,backdrop-filter] duration-500"
        style={{
          background: scrolled ? 'rgba(5,5,13,0.90)' : 'transparent',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">

          {/* ── Logo ── */}
          <a
            href="#"
            aria-label="FaceFit AI"
            className="flex items-center gap-2.5 group"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'instant' }) }}
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-xl bg-[var(--color-primary)] opacity-30 blur-lg group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative w-8 h-8 rounded-xl bg-[var(--color-surface-3)] border border-[var(--color-border-bright)] flex items-center justify-center">
                <Glasses className="w-[17px] h-[17px] text-[var(--color-primary-light)]" />
              </div>
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-[var(--color-foreground)] leading-none">
              FaceFit<span className="text-gradient-blue"> AI</span>
            </span>
          </a>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-white/[0.045] transition-all duration-200"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-white/[0.045] transition-all duration-200"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a
              href="#upload"
              className="btn-primary !text-[13px] !py-[7px] !px-[14px]"
            >
              Try it free
            </a>
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-white/[0.045] transition-all"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[64px] left-0 right-0 z-40 glass border-b border-[var(--color-border)] px-4 pb-4 pt-2 flex flex-col gap-0.5 md:hidden"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-sm text-[var(--color-foreground-2)] hover:text-[var(--color-foreground)] hover:bg-white/[0.04] transition-all"
              >
                {label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
