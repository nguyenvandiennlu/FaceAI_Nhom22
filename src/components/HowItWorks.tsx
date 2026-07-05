import { motion, Variants } from 'framer-motion'
import { Upload, Brain, ScanFace, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export default function HowItWorks() {
  const { t } = useTranslation()

  const STEPS = [
    {
      num: '01',
      icon: Upload,
      title: t('how_it_works.step1_title'),
      body: t('how_it_works.step1_body'),
      color: '#818cf8',
      glow: 'rgba(129,140,248,0.14)',
    },
    {
      num: '02',
      icon: Brain,
      title: t('how_it_works.step2_title'),
      body: t('how_it_works.step2_body'),
      color: '#c084fc',
      glow: 'rgba(192,132,252,0.14)',
    },
    {
      num: '03',
      icon: ScanFace,
      title: t('how_it_works.step3_title'),
      body: t('how_it_works.step3_body'),
      color: '#22d3ee',
      glow: 'rgba(34,211,238,0.11)',
    },
    {
      num: '04',
      icon: Sparkles,
      title: t('how_it_works.step4_title'),
      body: t('how_it_works.step4_body'),
      color: '#818cf8',
      glow: 'rgba(129,140,248,0.14)',
    },
  ]

  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-light)] mb-4">
            {t('how_it_works.badge')}
          </p>
          <h2
            className="font-black tracking-[-0.03em] text-balance mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            {t('how_it_works.title')}
          </h2>
          <p className="text-[15px] text-[var(--color-muted)] max-w-lg mx-auto leading-relaxed">
            {t('hero.desc')}
          </p>
        </motion.div>

        {/* Step cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {STEPS.map(({ num, icon: Icon, title, body, color, glow }) => (
            <motion.article key={num} variants={item}>
              <div className="glass-card rounded-2xl p-6 h-full relative overflow-hidden group">
                {/* Hover radial */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at 30% 0%, ${glow} 0%, transparent 65%)` }}
                />
                {/* Ghost number */}
                <span
                  className="absolute top-3 right-4 text-[4.5rem] font-black leading-none select-none pointer-events-none"
                  style={{ color, opacity: 0.07 }}
                >
                  {num}
                </span>
                {/* Icon */}
                <div
                  className="relative w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${color}18`, border: `1px solid ${color}28` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} aria-hidden="true" />
                </div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-muted-2)] uppercase mb-2">
                  Step {num}
                </p>
                <h3 className="text-[15px] font-semibold text-[var(--color-foreground)] mb-3 leading-snug">
                  {title}
                </h3>
                <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">{body}</p>
                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
                  style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
