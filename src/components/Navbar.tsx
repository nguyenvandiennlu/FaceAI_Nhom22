import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Glasses, ArrowUpRight, Menu, X, Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const NAV_LINKS = [
    { label: t('nav.features'), href: '#how-it-works' },
    { label: t('nav.models'),       href: '#models' },
    { label: t('nav.pipeline'),     href: '#pipeline' },
  ]

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
  }

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
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-[var(--color-primary)] opacity-30 blur-lg group-hover:opacity-60 transition-opacity duration-300" />
              {/* Custom SVG Biometric Eyewear Logo */}
              <svg className="w-8 h-8 text-[var(--color-primary-light)] relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* HUD Scan Brackets */}
                <path d="M22 35 C20 38, 20 42, 20 50 C20 58, 20 62, 22 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
                <path d="M78 35 C80 38, 80 42, 80 50 C80 58, 80 62, 78 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
                <path d="M42 22 C45 20, 48 20, 50 20 C52 20, 55 20, 58 22" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
                {/* Glasses shape */}
                <path d="M28 46 Q38 42 46 47" stroke="#22d3ee" strokeWidth="6.5" strokeLinecap="round" />
                <path d="M72 46 Q62 42 54 47" stroke="#22d3ee" strokeWidth="6.5" strokeLinecap="round" />
                <rect x="25" y="47" width="20" height="15" rx="5" stroke="#ffffff" strokeWidth="5.5" fill="none" />
                <rect x="55" y="47" width="20" height="15" rx="5" stroke="#ffffff" strokeWidth="5.5" fill="none" />
                <path d="M45 54 Q50 50 55 54" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
              </svg>
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
          <div className="flex items-center gap-2 h-9">
            {/* Language Toggle Pill with Custom SVG Flags */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-xl border border-white/[0.06] bg-white/[0.03] text-[13px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-white/[0.07] transition-all cursor-pointer select-none box-border"
              title={i18n.language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              style={{ height: '36px' }}
            >
              {i18n.language === 'vi' ? (
                // Vietnam Flag SVG (Circular)
                <svg className="w-4 h-4 rounded-full shrink-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="50" fill="#da251d" />
                  <path d="M50 20 L58.8 47.1 L87.1 47.1 L64.2 63.8 L73 90.9 L50 74.2 L27 90.9 L35.8 63.8 L12.9 47.1 L41.2 47.1 Z" fill="#ffff00" />
                </svg>
              ) : (
                // UK Flag SVG (Circularized)
                <svg className="w-4 h-4 rounded-full shrink-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <clipPath id="circle-clip">
                    <circle cx="50" cy="50" r="50" />
                  </clipPath>
                  <g clipPath="url(#circle-clip)">
                    <rect width="100" height="100" fill="#012169" />
                    {/* White saltire */}
                    <path d="M0 0 L100 100 M100 0 L0 100" stroke="#fff" strokeWidth="12" />
                    {/* Red saltire */}
                    <path d="M0 0 L100 100 M100 0 L0 100" stroke="#C8102E" strokeWidth="6" />
                    {/* White cross */}
                    <path d="M50 0 L50 100 M0 50 L100 50" stroke="#fff" strokeWidth="20" />
                    {/* Red cross */}
                    <path d="M50 0 L50 100 M0 50 L100 50" stroke="#C8102E" strokeWidth="12" />
                  </g>
                </svg>
              )}
              <span className="leading-none">{i18n.language === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            <a
              href="https://github.com/nguyenvandiennlu/FaceAI_Nhom22"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl text-[13px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-white/[0.045] transition-all duration-200 box-border"
              style={{ height: '36px' }}
            >
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-none">GitHub</span>
            </a>
            
            <a
              href="#upload"
              className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-[13px] font-semibold text-white transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] box-border"
              style={{ height: '36px', lineHeight: '36px' }}
            >
              <span className="leading-none">{t('results.reset')}</span>
            </a>
            
            <button
              className="md:hidden w-9 h-9 inline-flex items-center justify-center rounded-xl text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-white/[0.045] transition-all box-border"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              style={{ height: '36px', width: '36px' }}
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
