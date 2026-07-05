import { motion } from 'framer-motion'
import { Image as ImageIcon, Layers, GitMerge, Cpu, Glasses, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Pipeline() {
  const { t } = useTranslation()

  const STAGES = [
    {
      icon: ImageIcon, label: t('pipeline_sec.step1'), sublabel: t('pipeline_sec.step1_desc'),
      desc: 'Raw JPEG/PNG face photo via drag-drop or file picker.',
      color: '#818cf8',
    },
    {
      icon: Layers, label: t('pipeline_sec.step2'), sublabel: t('pipeline_sec.step2_desc'),
      desc: 'Face crop, 224×224 resize, pixel normalisation & HOG feature extraction.',
      color: '#c084fc',
    },
    {
      icon: GitMerge, label: t('pipeline_sec.step3'), sublabel: t('pipeline_sec.step3_desc'),
      desc: 'SVM + HOG, CNN, ResNet50, and EfficientNetV2 run concurrently.',
      color: '#22d3ee',
    },
    {
      icon: Cpu, label: t('pipeline_sec.step4'), sublabel: t('pipeline_sec.step4_desc'),
      desc: 'Confidence scores compared; highest-confidence model wins.',
      color: '#818cf8',
    },
    {
      icon: Glasses, label: t('pipeline_sec.step5'), sublabel: t('pipeline_sec.step5_desc'),
      desc: 'Face shape + ranked eyewear frames with compatibility scores.',
      color: '#c084fc',
    },
  ]

  const API = [
    {
      method: 'POST', path: '/predict',
      desc: 'multipart/form-data → face_shape, confidence, best_model, recommendations[]',
      color: '#22d3ee',
    },
    {
      method: 'GET', path: '/models',
      desc: 'Returns name, method, accuracy, speed, status for all four ML models.',
      color: '#818cf8',
    },
  ]

  return (
    <section id="pipeline" className="relative py-28 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-cyan-light)] mb-4">
            {t('pipeline_sec.badge')}
          </p>
          <h2
            className="font-black tracking-[-0.03em] text-balance mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            {t('pipeline_sec.title')}
          </h2>
          <p className="text-[15px] text-[var(--color-muted)] max-w-lg mx-auto leading-relaxed">
            {t('pipeline_sec.desc')}
          </p>
        </motion.div>

        {/* Pipeline stages */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0">
          {STAGES.map((stage, idx) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col lg:flex-row items-center flex-1 min-w-0"
            >
              {/* Card */}
              <div className="glass-card rounded-2xl p-5 w-full flex-1 relative overflow-hidden group">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${stage.color}18 0%, transparent 70%)` }}
                />
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${stage.color}18`, border: `1px solid ${stage.color}28` }}
                  >
                    <stage.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" style={{ color: stage.color }} aria-hidden="true" />
                  </div>
                  <p className="text-[10px] font-mono tracking-[0.2em] text-[var(--color-muted-2)] uppercase mb-1">
                    Step {String(idx + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-[14px] font-bold text-[var(--color-foreground)] mb-0.5">{stage.label}</h3>
                  <p className="text-[12px] font-semibold mb-3" style={{ color: stage.color }}>{stage.sublabel}</p>
                  <p className="text-[12px] text-[var(--color-muted)] leading-relaxed">{stage.desc}</p>
                </div>
              </div>

              {/* Connector */}
              {idx < STAGES.length - 1 && (
                <div className="flex items-center justify-center mx-1.5 my-2 lg:my-0 shrink-0">
                  <ArrowRight
                    className="w-4 h-4 text-[var(--color-primary)] opacity-40 rotate-90 lg:rotate-0"
                    aria-hidden="true"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* API spec */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 glass-card rounded-2xl p-6"
        >
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--color-muted)] mb-5">
            API endpoints
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {API.map((ep) => (
              <div key={ep.path} className="flex items-start gap-3">
                <span
                  className="text-[10px] font-bold font-mono px-2 py-0.5 rounded mt-0.5 shrink-0"
                  style={{ background: `${ep.color}18`, color: ep.color, border: `1px solid ${ep.color}28` }}
                >
                  {ep.method}
                </span>
                <div>
                  <p className="text-[13px] font-mono text-[var(--color-foreground)] mb-1">{ep.path}</p>
                  <p className="text-[12px] text-[var(--color-muted)] leading-relaxed">{ep.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
