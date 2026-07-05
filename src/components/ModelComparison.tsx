import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { CheckCircle2, Cpu } from 'lucide-react'
import type { ModelInfo } from '@/types'
import { formatPercent, getSpeedColor } from '@/lib/utils'

interface Props { models: ModelInfo[]; bestModel?: string }

const COLORS = ['#818cf8', '#c084fc', '#22d3ee', '#818cf8']

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; name: string }[] }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 text-[13px] border border-[var(--color-border-bright)] shadow-xl">
      <p className="font-semibold text-[var(--color-foreground)]">{payload[0].name}</p>
      <p className="text-[var(--color-cyan-light)] font-bold">{formatPercent(payload[0].value)}</p>
    </div>
  )
}

export default function ModelComparison({ models, bestModel }: Props) {
  const { t } = useTranslation()
  const chartData = models.map((m) => ({ name: m.name, accuracy: m.accuracy }))

  return (
    <section id="models" className="relative py-28 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-violet-light)] mb-4">
            {t('models_sec.badge')}
          </p>
          <h2
            className="font-black tracking-[-0.03em] text-balance mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            {t('models_sec.title')}
          </h2>
          <p className="text-[15px] text-[var(--color-muted)] max-w-lg mx-auto leading-relaxed">
            {t('models_sec.desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-[15px] font-semibold text-[var(--color-foreground)] mb-6">Accuracy comparison</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barSize={34}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'inherit' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  domain={[85, 98]}
                  tick={{ fill: 'var(--color-muted)', fontSize: 10, fontFamily: 'inherit' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.025)' }} />
                <Bar dataKey="accuracy" name="Accuracy" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={entry.name}
                      fill={entry.name === bestModel ? '#22d3ee' : COLORS[idx % COLORS.length]}
                      opacity={bestModel && entry.name !== bestModel ? 0.55 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Model cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3"
          >
            {models.map((model, idx) => {
              const isBest = model.name === bestModel
              const color = COLORS[idx % COLORS.length]
              return (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className="glass-card rounded-2xl px-5 py-4 flex items-center gap-4"
                  style={isBest ? { borderColor: 'rgba(34,211,238,0.3)', background: 'rgba(34,211,238,0.04)' } : {}}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}18`, border: `1px solid ${color}28` }}
                  >
                    <Cpu className="w-4 h-4" style={{ color }} aria-hidden="true" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[14px] font-semibold text-[var(--color-foreground)]">{model.name}</span>
                      {model.method && (
                        <span className="text-[10px] font-mono text-[var(--color-muted)] bg-white/[0.05] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                          {model.method}
                        </span>
                      )}
                      {isBest && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-cyan-light)] bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/25 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Best
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-[11px] text-[var(--color-muted)]">
                      <span>{t('models_sec.accuracy')}: <span className="text-[var(--color-foreground-2)] font-medium">{formatPercent(model.accuracy)}</span></span>
                      <span>{t('models_sec.speed')}: <span className={getSpeedColor(model.speed)}>{model.speed}</span></span>
                      <span>{t('models_sec.status')}: <span className="text-emerald-400">{model.status}</span></span>
                    </div>
                  </div>

                  {/* Accuracy pill */}
                  <span className="shrink-0 text-[1.15rem] font-black text-gradient-blue">
                    {formatPercent(model.accuracy)}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
