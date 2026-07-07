import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from 'recharts'
import { Cpu, Award, TrendingUp, Layers, Download, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PredictionResponse } from '@/types'
import { formatPercent, getConfidenceLabel } from '@/lib/utils'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

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
  
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    setIsExporting(true)

    try {
      // 1. Tạo một container báo cáo tạm thời được định dạng CSS thuần an toàn
      const reportContainer = document.createElement('div')
      reportContainer.style.position = 'fixed'
      reportContainer.style.left = '-9999px'
      reportContainer.style.top = '-9999px'
      reportContainer.style.width = '700px'
      reportContainer.style.padding = '40px'
      reportContainer.style.background = '#090d16'
      reportContainer.style.color = '#ffffff'
      reportContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif'
      reportContainer.style.borderRadius = '16px'
      reportContainer.style.border = '1px solid rgba(255,255,255,0.08)'

      // Lấy thời gian hiện tại
      const dateStr = new Date().toLocaleString('vi-VN')

      // Xây dựng nội dung HTML báo cáo A4
      reportContainer.innerHTML = `
        <div style="border-bottom: 2px solid #818cf8; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <svg style="width: 42px; height: 42px; color: #818cf8;" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 35 C20 38, 20 42, 20 50 C20 58, 20 62, 22 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
              <path d="M78 35 C80 38, 80 42, 80 50 C80 58, 80 62, 78 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
              <path d="M42 22 C45 20, 48 20, 50 20 C52 20, 55 20, 58 22" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
              <path d="M28 46 Q38 42 46 47" stroke="#22d3ee" strokeWidth="6.5" strokeLinecap="round" />
              <path d="M72 46 Q62 42 54 47" stroke="#22d3ee" strokeWidth="6.5" strokeLinecap="round" />
              <rect x="25" y="47" width="20" height="15" rx="5" stroke="#ffffff" strokeWidth="5.5" fill="none" />
              <rect x="55" y="47" width="20" height="15" rx="5" stroke="#ffffff" strokeWidth="5.5" fill="none" />
              <path d="M45 54 Q50 50 55 54" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
            </svg>
            <div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #818cf8; letter-spacing: -0.5px; line-height: 1;">FACEFIT AI</h1>
              <p style="margin: 4px 0 0 0; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; line-height: 1;">Biometric Analysis Report</p>
            </div>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 12px; color: #ffffff; font-weight: 600;">Đồ Án Môn ML - Nhóm 22</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #6b7280;">${dateStr}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 30px;">
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 24px; border-radius: 16px; text-align: center;">
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">KẾT QUẢ DỰ ĐOÁN DÁNG MẶT</p>
            <h2 style="margin: 0; font-size: 32px; font-weight: 900; color: #22d3ee;">${t(`results.shapes.${face_shape}`, face_shape)}</h2>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #e5e7eb;">Độ tin cậy của AI: <strong style="color: #818cf8; font-size: 18px;">${confPct}%</strong></p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af; font-style: italic;">(${getConfidenceLabel(confidence)})</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 16px 0; font-size: 14px; color: #818cf8; text-transform: uppercase; letter-spacing: 1px; border-left: 3px solid #818cf8; padding-left: 8px;">Đặc trưng hình học dáng mặt</h3>
          <ul style="margin: 0; padding-left: 20px; color: #d1d5db; font-size: 13px; line-height: 1.8;">
            ${traits.map(trait => `
              <li style="margin-bottom: 6px;">${t(`results.traits.${trait}`, trait)}</li>
            `).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 35px;">
          <h3 style="margin: 0 0 16px 0; font-size: 14px; color: #818cf8; text-transform: uppercase; letter-spacing: 1px; border-left: 3px solid #818cf8; padding-left: 8px;">Đề xuất kính mắt phù hợp nhất</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${recommendations.map((rec, idx) => `
              <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-size: 11px; font-weight: bold; color: ${idx === 0 ? '#22d3ee' : '#9ca3af'}; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${idx === 0 ? 'Hợp Nhất (Best Match)' : `Hạng ${idx + 1}`}
                  </span>
                  <h4 style="margin: 4px 0 0 0; font-size: 16px; font-weight: bold; color: #ffffff;">
                    Dáng kính ${t(`results.frames.${rec.frame}`, rec.frame)}
                  </h4>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 11px; color: #9ca3af;">Điểm tương thích</span>
                  <div style="font-size: 20px; font-weight: 900; color: #22d3ee;">${rec.score}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #6b7280;">
          <p style="margin: 0;">Mô hình phân tích: <strong>${best_model}</strong></p>
          <p style="margin: 0;">FaceFit AI Engine v1.0.0 © 2026</p>
        </div>
      `

      document.body.appendChild(reportContainer)

      // 2. Chụp màn hình container tạm thời này bằng html2canvas
      const canvas = await html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#090d16',
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')
      
      // Khởi tạo PDF khổ A4 dọc
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210 // Khổ A4 rộng 210mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

      // Xóa bỏ container tạm thời khỏi DOM
      document.body.removeChild(reportContainer)

      // Lưu file PDF
      pdf.save(`FaceFit_AI_Report_${face_shape}.pdf`)
    } catch (error) {
      console.error('Failed to export PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

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

        {/* Thẻ bọc hiển thị Dashboard chính trên màn hình web */}
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

        {/* Footer actions with Export PDF Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.04] pt-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-2 text-[12px] text-[var(--color-muted)]"
          >
            <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
            {t('results.analysed_by')}{' '}
            <span className="text-[var(--color-primary-light)]">{best_model}</span>
            {' '}·{' '}
            <span className="text-[var(--color-primary-light)]">{formatPercent(confidence * 100, 0)}</span>
            {' '}{t('results.confidence')}
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn-primary group flex items-center gap-2 py-2.5 px-5 text-sm"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('results.exporting_pdf', 'Đang tạo báo cáo...')}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
                {t('results.export_pdf', 'Tải Báo Cáo PDF')}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </section>
  )
}
