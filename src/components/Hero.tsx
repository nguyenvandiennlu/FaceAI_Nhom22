import { useEffect, useRef } from 'react'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, Cpu, Zap, Target, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number
    let lastTime = 0
    const INTERVAL = 1000 / 30 // throttle to 30 fps
    const DIST_SQ = 120 * 120   // use squared distance — no Math.hypot

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const N = 30  // reduced from 55 → O(n²) drops from 1485 to 435 per frame
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }))

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (now - lastTime < INTERVAL) return  // skip frame — throttle to 30fps
      lastTime = now

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        else if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        else if (p.y > canvas.height) p.y = 0
      }

      ctx.lineWidth = 0.7
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dSq = dx * dx + dy * dy
          if (dSq < DIST_SQ) {
            const alpha = 0.13 * (1 - Math.sqrt(dSq) / 120)
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(99,102,241,${alpha.toFixed(3)})`
            ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.arc(pts[i].x, pts[i].y, 1.3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(99,102,241,0.5)'
        ctx.fill()
      }
    }

    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-16">
      {/* Canvas mesh */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" style={{ willChange: 'transform' }} />

      {/* Ambient orbs — 2 max to minimise GPU layer count */}
      <div className="absolute top-[18%] left-[30%] w-[420px] h-[420px] rounded-full bg-[var(--color-primary)] opacity-[0.07] blur-[100px] pointer-events-none float" />
      <div className="absolute bottom-[20%] right-[22%] w-[320px] h-[320px] rounded-full bg-[var(--color-violet)] opacity-[0.07] blur-[90px] pointer-events-none float" style={{ animationDelay: '2.5s' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* Badge */}
          <motion.div variants={up} className="flex justify-center mb-8">
            <span className="badge-glow chip text-[var(--color-primary-light)] gap-1.5">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={up}
            className="font-black tracking-[-0.04em] text-balance mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', lineHeight: '1.04' }}
          >
            {t('hero.title')}
            <span className="text-gradient">{t('hero.title_gradient')}</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={up}
            className="text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}
          >
            {t('hero.desc')}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={up} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <a href="#upload" className="btn-primary group">
              {t('hero.cta_start')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
            </a>
            <a href="#how-it-works" className="btn-ghost">
              {t('nav.features')}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={up}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
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
