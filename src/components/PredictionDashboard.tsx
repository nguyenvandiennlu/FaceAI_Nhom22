import { motion } from 'framer-motion'
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from 'recharts'
import { Cpu, Award, TrendingUp, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PredictionResponse } from '@/types'
import { formatPercent, getConfidenceLabel } from '@/lib/utils'

interface Props { prediction: PredictionResponse }

const FACE_TRAITS: Record<string, string[]> = {
  Oval:     ['Balanced proportions', 'Wider forehead', 'Gently rounded jaw'],
  Round:    ['Equal width and length', 'Soft jawline', 'Full cheeks'],
  Square:   ['Strong jaw', 'Broad forehead', 'Angular features'],
  Heart:    ['Wide forehead', 'High cheekbones', 'Narrow chin'],
  Diamond:  ['Narrow forehead & chin', 'High cheekbones', 'Angular overall'],
  Oblong:   ['Longer than wide', 'Straight cheekbones', 'Narrow face'],
  Triangle: ['Narrow forehead', 'Wide jawline', 'Strong chin'],
}

const TRAIT_COLORS = ['#818cf8', '#c084fc', '#22d3ee']

export default function PredictionDashboard({ prediction }: Props) {
  const { t } = useTranslation()
  const { face_shape, confidence, best_model, recommendations } = prediction
  const confPct = Math.round(confidence * 100)
  const traits = FACE_TRAITS[face_shape] ?? ['Unique proportions']

  return (
    <section className="py-16">
      {/* Gradient defs for Recharts */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-light)] mb-4">
            {t('nav.upload')}
          </p>
          <h2
            className="font-black tracking-[-0.03em] text-balance"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            {t('results.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Face shape hero card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-2xl p-7 flex flex-col items-center text-center lg:col-span-1"
          >
            {/* Radial gauge */}
            <div className="relative w-44 h-44 mb-5">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%" innerRadius="70%" outerRadius="100%"
                  startAngle={220} endAngle={-40}
                  data={[{ value: confPct }]}
                >
                  <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'rgba(255,255,255,0.04)' }}>
                    <Cell fill="url(#confGrad)" />
                  </RadialBar>
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[var(--color-foreground)] leading-none">{confPct}%</span>
                <span className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-muted)] mt-1">
                  {t('results.confidence')}
                </span>
              </div>
            </div>

            <h3 className="text-gradient font-black mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              {t(`results.shapes.${face_shape}`, face_shape)}
            </h3>
            <p className="text-[13px] text-[var(--color-muted)] mb-6">
              {getConfidenceLabel(confidence)} {t('results.match')}
            </p>

            {/* Traits */}
            <ul className="w-full space-y-2.5 text-left">
              {traits.map((trait, i) => (
                <li key={trait} className="flex items-center gap-3 text-[13px] text-[var(--color-foreground-2)]">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TRAIT_COLORS[i % 3] }} />
                  {t(`results.traits.${trait}`, trait)}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Stats grid ── */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Best model */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(192,132,252,0.12)', border: '1px solid rgba(192,132,252,0.22)' }}>
                  <Award className="w-5 h-5 text-[var(--color-violet-light)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-muted)]">
                    {t('results.best_model')}
                  </p>
                  <p className="text-[15px] font-semibold text-[var(--color-foreground)]">{best_model}</p>
                </div>
              </div>
              <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">
                {best_model} {t('results.best_model_desc')}
              </p>
            </motion.div>

            {/* Top frame */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                  <TrendingUp className="w-5 h-5 text-[var(--color-cyan-light)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-muted)]">
                    {t('results.top_frame')}
                  </p>
                  <p className="text-[15px] font-semibold text-[var(--color-foreground)]">
                    {t(`results.frames.${recommendations[0]?.frame}`, recommendations[0]?.frame ?? '—')}
                  </p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-[13px] text-[var(--color-muted)]">
                  {t('results.compatibility')}
                </p>
                <span className="text-[2rem] font-black text-gradient-blue leading-none">
                  {recommendations[0]?.score ?? 0}
                </span>
              </div>
            </motion.div>

            {/* Frame score bars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6 sm:col-span-2"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.22)' }}>
                  <Layers className="w-5 h-5 text-[var(--color-primary-light)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-muted)]">
                    {t('results.frame_scores')}
                  </p>
                  <p className="text-[15px] font-semibold text-[var(--color-foreground)]">
                    {t('results.frame_scores')}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec, idx) => {
                  const colors = [
                    'linear-gradient(90deg,#818cf8,#22d3ee)',
                    'linear-gradient(90deg,#c084fc,#818cf8)',
                    'linear-gradient(90deg,#44445e,#6b7280)',
                  ]
                  return (
                    <div key={rec.frame} className="space-y-1.5">
                      <div className="flex justify-between text-[13px]">
                        <span className="font-medium text-[var(--color-foreground)]">
                          {t(`results.frames.${rec.frame}`, rec.frame)}
                        </span>
                        <span className="text-[var(--color-muted)]">{formatPercent(rec.score, 0)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${rec.score}%` }}
                          transition={{ duration: 0.9, delay: 0.35 + idx * 0.1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: colors[idx % 3] }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-6 flex items-center gap-2 justify-center text-[12px] text-[var(--color-muted)]"
        >
          <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
          {t('results.analysed_by')}{' '}
          <span className="text-[var(--color-primary-light)]">{best_model}</span>
          {' '}·{' '}
          <span className="text-[var(--color-primary-light)]">{formatPercent(confidence * 100, 0)}</span>
          {' '}{t('results.confidence')}
        </motion.p>
      </div>
    </section>
  )
}
