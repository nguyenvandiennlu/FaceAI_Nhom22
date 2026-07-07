import { motion } from 'framer-motion'
import { Star, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FrameRecommendation } from '@/types'
import { FRAME_DETAILS } from '@/types'

interface Props { 
  recommendations: FrameRecommendation[]
  faceShape: string
  selectedGlass: string | null
  onGlassSelect: (glass: string | null) => void
}

const RANKS = ['Best match', 'Great match', 'Good match']
const PALETTES = [
  { color: '#818cf8', bg: 'rgba(129,140,248,0.10)', border: 'rgba(129,140,248,0.28)' },
  { color: '#c084fc', bg: 'rgba(192,132,252,0.10)', border: 'rgba(192,132,252,0.28)' },
  { color: '#22d3ee', bg: 'rgba(34,211,238,0.09)',  border: 'rgba(34,211,238,0.25)'  },
]

export default function RecommendationCards({ recommendations, faceShape, selectedGlass, onGlassSelect }: Props) {
  const { t } = useTranslation()
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
            {t('results.eyewear_recs')}
          </p>
          <h2
            className="font-black tracking-[-0.03em] text-balance mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            {t('results.eyewear_recs')} – <span className="text-gradient">{faceShape}</span>
          </h2>
          <p className="text-[15px] text-[var(--color-muted)] max-w-lg mx-auto leading-relaxed">
            {t('results.recs_desc')}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendations.map((rec, idx) => {
            const details = FRAME_DETAILS[rec.frame]
            const pal = PALETTES[idx % PALETTES.length]
            const label = RANKS[idx] ?? 'Match'
            const isTryingOn = selectedGlass === rec.frame

            return (
              <motion.article
                key={rec.frame}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => onGlassSelect(isTryingOn ? null : rec.frame)}
                transition={{ delay: idx * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`glass-card rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] select-none ${
                  isTryingOn ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-black shadow-[0_0_25px_rgba(99,102,241,0.25)]' : 'hover:border-white/20'
                }`}
                style={{ borderColor: isTryingOn ? 'var(--color-primary)' : pal.border }}
              >
                {/* Score band */}
                <div className="px-6 py-4 flex items-center justify-between" style={{ background: isTryingOn ? 'rgba(99,102,241,0.15)' : pal.bg }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: isTryingOn ? 'var(--color-primary-light)' : pal.color }} aria-hidden="true" />
                    <span className="text-[10px] font-bold tracking-[0.16em] uppercase" style={{ color: isTryingOn ? 'var(--color-primary-light)' : pal.color }}>
                      {isTryingOn ? t('results.trying_on', '🎯 Đang Đeo Thử') : t(`results.ranks.${label}`, label)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" style={{ color: pal.color }} aria-hidden="true" />
                    <span className="text-xl font-black" style={{ color: pal.color }}>{rec.score}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Eyewear Shape SVG Visualization */}
                  <div className="w-full h-32 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                    
                    {/* Render custom frame SVG path */}
                    {rec.frame === 'Rectangle' && (
                      <svg className="w-24 h-12 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="5" y="10" width="35" height="20" rx="4" stroke={pal.color} strokeWidth="3" fill={`${pal.color}08`} />
                        <rect x="60" y="10" width="35" height="20" rx="4" stroke={pal.color} strokeWidth="3" fill={`${pal.color}08`} />
                        <path d="M40 18 Q50 14 60 18" stroke={pal.color} strokeWidth="3" strokeLinecap="round" />
                        <path d="M5 15 L2 12" stroke={pal.color} strokeWidth="2" strokeLinecap="round" />
                        <path d="M95 15 L98 12" stroke={pal.color} strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                    {rec.frame === 'Wayfarer' && (
                      <svg className="w-24 h-12 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 8 C15 7, 30 9, 38 12 C36 28, 12 32, 7 24 C4 18, 4 9, 5 8 Z" stroke={pal.color} strokeWidth="3.5" fill={`${pal.color}08`} strokeLinejoin="round" />
                        <path d="M95 8 C85 7, 70 9, 62 12 C64 28, 88 32, 93 24 C96 18, 96 9, 95 8 Z" stroke={pal.color} strokeWidth="3.5" fill={`${pal.color}08`} strokeLinejoin="round" />
                        <path d="M38 12 Q50 9 62 12" stroke={pal.color} strokeWidth="3.5" strokeLinecap="round" />
                        <circle cx="9" cy="11" r="1.5" fill={pal.color} />
                        <circle cx="91" cy="11" r="1.5" fill={pal.color} />
                      </svg>
                    )}
                    {rec.frame === 'Aviator' && (
                      <svg className="w-24 h-14 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 10 Q25 8 40 13 Q35 37 15 35 Q5 33 5 10 Z" stroke={pal.color} strokeWidth="2.5" fill={`${pal.color}06`} />
                        <path d="M95 10 Q75 8 60 13 Q65 37 85 35 Q95 33 95 10 Z" stroke={pal.color} strokeWidth="2.5" fill={`${pal.color}06`} />
                        <path d="M40 13 H60" stroke={pal.color} strokeWidth="2.5" />
                        <path d="M38 9 Q50 7 62 9" stroke={pal.color} strokeWidth="2" />
                      </svg>
                    )}
                    {rec.frame === 'Round' && (
                      <svg className="w-24 h-12 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="23" cy="20" r="14" stroke={pal.color} strokeWidth="2.5" fill={`${pal.color}08`} />
                        <circle cx="77" cy="20" r="14" stroke={pal.color} strokeWidth="2.5" fill={`${pal.color}08`} />
                        <path d="M37 20 Q50 14 63 20" stroke={pal.color} strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M9 10 Q4 5 1 12" stroke={pal.color} strokeWidth="1.5" />
                        <path d="M91 10 Q96 5 99 12" stroke={pal.color} strokeWidth="1.5" />
                      </svg>
                    )}
                    {rec.frame === 'Cat-eye' && (
                      <svg className="w-24 h-12 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 10 Q24 7 38 16 Q36 31 16 28 Q2 25 2 10 Z" stroke={pal.color} strokeWidth="3" fill={`${pal.color}08`} />
                        <path d="M98 10 Q76 7 62 16 Q64 31 84 28 Q98 25 98 10 Z" stroke={pal.color} strokeWidth="3" fill={`${pal.color}08`} />
                        <path d="M38 16 Q50 12 62 16" stroke={pal.color} strokeWidth="3" />
                        <path d="M2 10 Q8 6 12 10" stroke={pal.color} strokeWidth="2.5" fill={pal.color} />
                        <path d="M98 10 Q92 6 88 10" stroke={pal.color} strokeWidth="2.5" fill={pal.color} />
                      </svg>
                    )}
                    {rec.frame === 'Browline' && (
                      <svg className="w-24 h-12 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Upper plastic rim (Thick) */}
                        <path d="M4 12 Q24 9 40 14" stroke={pal.color} strokeWidth="5.5" strokeLinecap="round" />
                        <path d="M96 12 Q76 9 60 14" stroke={pal.color} strokeWidth="5.5" strokeLinecap="round" />
                        {/* Lower metal rim (Thin) */}
                        <path d="M4 12 Q14 28 40 28" stroke={pal.color} strokeWidth="1.5" fill="none" />
                        <path d="M96 12 Q86 28 60 28" stroke={pal.color} strokeWidth="1.5" fill="none" />
                        <path d="M40 14 Q50 12 60 14" stroke={pal.color} strokeWidth="3.5" />
                      </svg>
                    )}
                  </div>

                  <h3 className="text-[17px] font-bold text-[var(--color-foreground)] mb-3">
                    {t(`results.frames.${rec.frame}`, rec.frame)}
                  </h3>

                  {details ? (
                    <>
                      <p className="text-[13px] text-[var(--color-muted)] leading-relaxed mb-5">
                        {t(`results.descriptions.${rec.frame}`, details.description)}
                      </p>
                      <div className="mt-auto">
                        <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--color-muted)] mb-3">
                          {t('results.best_for')}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {details.bestFor.map((face) => (
                            <span
                              key={face}
                              className="text-[11px] px-2.5 py-1 rounded-full"
                              style={{ background: pal.bg, color: pal.color, border: `1px solid ${pal.border}` }}
                            >
                              {t(`results.faces.${face}`, face)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">
                      {t('results.recs_desc')}
                    </p>
                  )}

                  {/* Compatibility bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-[12px] text-[var(--color-muted)] mb-2">
                      <span>{t('results.compatibility')}</span>
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
