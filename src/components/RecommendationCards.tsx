import { motion } from 'framer-motion'
import { Star, CheckCircle2 } from 'lucide-react'
import type { FrameRecommendation } from '@/types'
import { FRAME_DETAILS } from '@/types'

interface Props { recommendations: FrameRecommendation[]; faceShape: string }

const RANKS = ['Best match', 'Great match', 'Good match']
const PALETTES = [
  { color: '#818cf8', bg: 'rgba(129,140,248,0.10)', border: 'rgba(129,140,248,0.28)' },
  { color: '#c084fc', bg: 'rgba(192,132,252,0.10)', border: 'rgba(192,132,252,0.28)' },
  { color: '#22d3ee', bg: 'rgba(34,211,238,0.09)',  border: 'rgba(34,211,238,0.25)'  },
]

export default function RecommendationCards({ recommendations, faceShape }: Props) {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-light)] mb-4">
            Recommendations
          </p>
          <h2
            className="font-black tracking-[-0.03em] text-balance mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            Perfect frames for your{' '}
            <span className="text-gradient">{faceShape}</span> face
          </h2>
          <p className="text-[15px] text-[var(--color-muted)] max-w-lg mx-auto leading-relaxed">
            Each style is scored by our AI based on how well it complements your specific facial
            proportions and features.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendations.map((rec, idx) => {
            const details = FRAME_DETAILS[rec.frame]
            const pal = PALETTES[idx % PALETTES.length]
            const label = RANKS[idx] ?? 'Match'

            return (
              <motion.article
                key={rec.frame}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col"
                style={{ borderColor: pal.border }}
              >
                {/* Score band */}
                <div className="px-6 py-4 flex items-center justify-between" style={{ background: pal.bg }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: pal.color }} aria-hidden="true" />
                    <span className="text-[10px] font-bold tracking-[0.16em] uppercase" style={{ color: pal.color }}>
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" style={{ color: pal.color }} aria-hidden="true" />
                    <span className="text-xl font-black" style={{ color: pal.color }}>{rec.score}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[17px] font-bold text-[var(--color-foreground)] mb-3">
                    {rec.frame} Frames
                  </h3>

                  {details ? (
                    <>
                      <p className="text-[13px] text-[var(--color-muted)] leading-relaxed mb-5">
                        {details.description}
                      </p>
                      <div className="mt-auto">
                        <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--color-muted)] mb-3">
                          Best for
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {details.bestFor.map((face) => (
                            <span
                              key={face}
                              className="text-[11px] px-2.5 py-1 rounded-full"
                              style={{ background: pal.bg, color: pal.color, border: `1px solid ${pal.border}` }}
                            >
                              {face}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">
                      A versatile frame style that suits {faceShape.toLowerCase()} face shapes with a
                      compatibility score of {rec.score}.
                    </p>
                  )}

                  {/* Compatibility bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-[12px] text-[var(--color-muted)] mb-2">
                      <span>Compatibility</span>
                      <span style={{ color: pal.color }}>{rec.score} / 100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${rec.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.25 + idx * 0.1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: pal.color }}
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
