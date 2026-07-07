import { motion, Variants } from 'framer-motion'
import { ArrowRight, Cpu, Zap, Target, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Particles from './react-bits/Particles'
import DecryptedText from './react-bits/DecryptedText'
import FaceMesh3D from './react-bits/FaceMesh3D'

const STATS = [
  { icon: Cpu,    label: 'ML models',    value: '4',       color: '#818cf8' },
  { icon: Target, label: 'Top accuracy', value: '96.8%',   color: '#22d3ee' },
  { icon: Zap,    label: 'Inference',    value: '<200 ms', color: '#c084fc' },
]

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }
const up: Variants = {
  hidden: { opacity: 0, y: 20, transform: 'translateZ(0)' },
  show:   { opacity: 1, y: 0,  transform: 'translateZ(0)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-16">
      {/* Particles dynamic background */}
      <Particles quantity={65} staticity={30} ease={40} />

      {/* Ambient orbs — 2 max to minimise GPU layer count */}
      <div className="absolute top-[18%] left-[30%] w-[420px] h-[420px] rounded-full bg-[var(--color-primary)] opacity-[0.07] blur-[100px] pointer-events-none float" />
      <div className="absolute bottom-[20%] right-[22%] w-[320px] h-[320px] rounded-full bg-[var(--color-violet)] opacity-[0.07] blur-[90px] pointer-events-none float" style={{ animationDelay: '2.5s' }} />

      <div className="relative z-10 max-w-6xl w-full mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          {/* Cột trái: Văn bản & CTA (7/12) */}
          <motion.div 
            variants={stagger} 
            initial="hidden" 
            animate="show"
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Badge */}
            <motion.div variants={up} className="mb-6">
              <span className="badge-glow chip text-[var(--color-primary-light)] gap-1.5 font-mono">
                <Sparkles className="w-3 h-3 text-[var(--color-primary-light)]" aria-hidden="true" />
                <DecryptedText 
                  text="FACEFIT AI NEURAL NETWORK" 
                  speed={40} 
                  maxIterations={10} 
                  className="tracking-wider cursor-default"
                />
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={up}
              className="font-black tracking-[-0.04em] text-balance mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.8rem)', lineHeight: '1.04' }}
            >
              {t('hero.title')}{' '}
              <span className="text-gradient font-black">{t('hero.title_gradient')}</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={up}
              className="text-[var(--color-muted)] max-w-xl leading-relaxed mb-8 text-left"
              style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)' }}
            >
              {t('hero.desc')}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={up} className="flex flex-col sm:flex-row items-center gap-3 mb-12 w-full sm:w-auto">
              <a href="#upload" className="btn-primary group w-full sm:w-auto justify-center">
                {t('hero.cta_start')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
              </a>
              <a href="#how-it-works" className="btn-ghost w-full sm:w-auto justify-center">
                {t('nav.features')}
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={up}
              className="flex flex-wrap items-center gap-3"
            >
              {STATS.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="glass-card rounded-2xl px-5 py-3.5 flex items-center gap-3 min-w-[156px]">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                    <Icon className="w-4 h-4" style={{ color }} aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] text-[var(--color-muted)] leading-none mb-1">{label}</p>
                    <p className="text-[15px] font-bold text-[var(--color-foreground)] leading-none">{value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Cột phải: Mô hình 3D FaceMesh (5/12) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex items-center justify-center lg:justify-end"
          >
            <FaceMesh3D />
          </motion.div>

        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-muted-2)]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-[var(--color-primary)] to-transparent"
        />
      </motion.div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-[var(--color-background)] to-transparent pointer-events-none" />
    </section>
  )
}
