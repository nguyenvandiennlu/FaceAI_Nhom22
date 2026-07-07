import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, ImageIcon, Loader2, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { UploadState, ModelInfo } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  uploadState: UploadState
  imagePreviewUrl: string | null
  errorMessage: string | null
  selectedModel: string
  onModelChange: (model: string) => void
  models: ModelInfo[]
  onFileSelect: (file: File) => void
  onAnalyze: () => void
  onReset: () => void
  selectedGlass: string | null
  onGlassChange: (glass: string | null) => void
}

export default function UploadSection({
  uploadState,
  imagePreviewUrl,
  errorMessage,
  selectedModel,
  onModelChange,
  models,
  onFileSelect,
  onAnalyze,
  onReset,
  selectedGlass,
  onGlassChange,
}: Props) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // State điều khiển kính thử
  const [glassScale, setGlassScale] = useState<number>(1.0)
  const [glassRotate, setGlassRotate] = useState<number>(0)

  const handleFile = useCallback(
    (file: File) => { if (file.type.startsWith('image/')) onFileSelect(file) },
    [onFileSelect],
  )
  const handleDrop = useCallback(
    (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) },
    [handleFile],
  )
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) handleFile(f) }

  const isLoading = uploadState === 'uploading' || uploadState === 'analyzing'

  const MODELS_LIST = [
    { id: 'SVM', name: 'SVM', acc: '84.1%', desc: 'HOG + LinearSVC' },
    { id: 'CNN', name: 'CNN Custom', acc: '89.2%', desc: 'Lightweight CNN' },
    { id: 'ResNet50', name: 'ResNet50', acc: '96.8%', desc: 'Deep Transfer Learning' },
    { id: 'EfficientNetV2', name: 'EfficientNetV2', acc: '95.4%', desc: 'State-of-the-art AI' }
  ]

  return (
    <section id="upload" className="relative py-28 overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-light)] mb-4">
            {t('nav.upload')}
          </p>
          <h2
            className="font-black tracking-[-0.03em] text-balance mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            {t('upload.title')}
          </h2>
          <p className="text-[15px] text-[var(--color-muted)] max-w-md mx-auto leading-relaxed">
            {t('upload.desc')}
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-3xl p-6 glow-primary"
        >
          {/* Drop zone / preview */}
          <AnimatePresence mode="wait">
            {!imagePreviewUrl ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload photo"
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed transition-all duration-250 cursor-pointer min-h-[300px] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                  isDragging
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/[0.06] scale-[1.01]'
                    : 'border-[var(--color-border-mid)] hover:border-[var(--color-primary)]/50 hover:bg-white/[0.02]',
                )}
              >
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

                <div className="relative">
                  <div
                    className={cn(
                      'flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-[var(--color-muted)] transition-all duration-300',
                      isDragging && 'border-[var(--color-primary)]/30 text-[var(--color-primary)] bg-[var(--color-primary)]/[0.03] scale-105',
                    )}
                  >
                    <Upload className="w-6 h-6" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[15px] font-bold text-[var(--color-foreground)] mb-1">
                    {isDragging ? t('upload.drag_active') : t('upload.drag_idle')}
                  </p>
                  <p className="text-[13px] text-[var(--color-primary-light)] font-medium">
                    {t('upload.browse')}
                  </p>
                </div>

                <p className="text-[11px] text-[var(--color-muted)] font-medium tracking-wide">
                  {t('upload.max_size')}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                ref={previewContainerRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative rounded-2xl border border-white/[0.08] overflow-hidden bg-black/25 flex flex-col items-center justify-center min-h-[380px] p-4"
              >
                <div className="relative flex items-center justify-center w-full h-full">
                  <img
                    src={imagePreviewUrl}
                    alt="Face shape preview"
                    className="max-h-[380px] w-auto object-contain select-none relative rounded-lg"
                  />

                  {/* ─── HIỆU ỨNG BIOMETRIC SCANNER KHI ĐANG PHÂN TÍCH ─── */}
                  {isLoading && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center">
                      {/* Laser Scanline */}
                      <motion.div 
                        animate={{ y: ['-160%', '160%'] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary-light)] to-transparent opacity-80 blur-[0.5px]"
                        style={{ top: '50%' }}
                      />
                      {/* Light Glow under the laser */}
                      <motion.div 
                        animate={{ y: ['-160%', '160%'] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-8 bg-gradient-to-r from-transparent via-[var(--color-primary)]/10 to-transparent opacity-50 blur-md"
                        style={{ top: '50%', transform: 'translateY(-50%)' }}
                      />

                      {/* HUD Target brackets */}
                      <div className="absolute w-[220px] h-[220px] border border-[var(--color-primary)]/20 rounded-3xl flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-[var(--color-primary)]/10 rounded-3xl animate-[spin_40s_linear_infinite]" />
                        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[var(--color-primary-light)] rounded-tl-lg" />
                        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[var(--color-primary-light)] rounded-tr-lg" />
                        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[var(--color-primary-light)] rounded-bl-lg" />
                        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[var(--color-primary-light)] rounded-br-lg" />
                      </div>
                    </div>
                  )}

                  {/* ─── BỘ GHÉP KÍNH THỬ ẢO TƯƠNG TÁC (VIRTUAL TRY-ON) ─── */}
                  {uploadState === 'done' && selectedGlass && (
                    <motion.div
                      drag
                      dragMomentum={false}
                      dragConstraints={previewContainerRef}
                      style={{ 
                        scale: glassScale, 
                        rotate: `${glassRotate}deg`,
                        touchAction: 'none'
                      }}
                      className="absolute z-30 cursor-grab active:cursor-grabbing w-32 h-14 flex items-center justify-center select-none"
                    >
                      {/* SVG các gọng kính tương tự như RecommendationCards nhưng vẽ lớn sắc nét */}
                      {selectedGlass === 'Rectangle' && (
                        <svg className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="5" y="10" width="35" height="20" rx="4" stroke="#ffffff" strokeWidth="3.5" fill="rgba(255,255,255,0.1)" />
                          <rect x="60" y="10" width="35" height="20" rx="4" stroke="#ffffff" strokeWidth="3.5" fill="rgba(255,255,255,0.1)" />
                          <path d="M40 18 Q50 13 60 18" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                          <path d="M5 15 C-2 15 -5 10 -5 10" stroke="#ffffff" strokeWidth="2.5" />
                          <path d="M95 15 C102 15 105 10 105 10" stroke="#ffffff" strokeWidth="2.5" />
                        </svg>
                      )}
                      {selectedGlass === 'Wayfarer' && (
                        <svg className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 8 C15 7, 30 9, 38 12 C36 28, 12 32, 7 24 C4 18, 4 9, 5 8 Z" stroke="#111111" strokeWidth="4" fill="rgba(0,0,0,0.15)" strokeLinejoin="round" />
                          <path d="M95 8 C85 7, 70 9, 62 12 C64 28, 88 32, 93 24 C96 18, 96 9, 95 8 Z" stroke="#111111" strokeWidth="4" fill="rgba(0,0,0,0.15)" strokeLinejoin="round" />
                          <path d="M38 12 Q50 9 62 12" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
                          <circle cx="9" cy="11" r="1.5" fill="#ffffff" />
                          <circle cx="91" cy="11" r="1.5" fill="#ffffff" />
                          <path d="M5 8 C-2 8 -5 4 -5 4" stroke="#111111" strokeWidth="2.5" />
                          <path d="M95 8 C102 8 105 4 105 4" stroke="#111111" strokeWidth="2.5" />
                        </svg>
                      )}
                      {selectedGlass === 'Aviator' && (
                        <svg className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" viewBox="0 0 100 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 10 Q25 8 40 13 Q35 37 15 35 Q5 33 5 10 Z" stroke="#d4af37" strokeWidth="3" fill="rgba(212,175,55,0.08)" />
                          <path d="M95 10 Q75 8 60 13 Q65 37 85 35 Q95 33 95 10 Z" stroke="#d4af37" strokeWidth="3" fill="rgba(212,175,55,0.08)" />
                          <path d="M40 13 H60" stroke="#d4af37" strokeWidth="3" />
                          <path d="M38 9 Q50 7 62 9" stroke="#d4af37" strokeWidth="2" />
                          <path d="M5 10 C-2 10 -5 6 -5 6" stroke="#d4af37" strokeWidth="2" />
                          <path d="M95 10 C102 10 105 6 105 6" stroke="#d4af37" strokeWidth="2" />
                        </svg>
                      )}
                      {selectedGlass === 'Round' && (
                        <svg className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="23" cy="20" r="14" stroke="#22d3ee" strokeWidth="3.5" fill="rgba(34,211,238,0.08)" />
                          <circle cx="77" cy="20" r="14" stroke="#22d3ee" strokeWidth="3.5" fill="rgba(34,211,238,0.08)" />
                          <path d="M37 20 Q50 13 63 20" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />
                          <path d="M9 10 C3 7 1 12 1 12" stroke="#22d3ee" strokeWidth="2" />
                          <path d="M91 10 C97 7 99 12 99 12" stroke="#22d3ee" strokeWidth="2" />
                        </svg>
                      )}
                      {selectedGlass === 'Cat-eye' && (
                        <svg className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 10 Q24 7 38 16 Q36 31 16 28 Q2 25 2 10 Z" stroke="#ec4899" strokeWidth="3.5" fill="rgba(236,72,153,0.1)" />
                          <path d="M98 10 Q76 7 62 16 Q64 31 84 28 Q98 25 98 10 Z" stroke="#ec4899" strokeWidth="3.5" fill="rgba(236,72,153,0.1)" />
                          <path d="M38 16 Q50 12 62 16" stroke="#ec4899" strokeWidth="3.5" />
                          <path d="M2 10 Q8 6 12 10" stroke="#ec4899" strokeWidth="3" fill="#ec4899" />
                          <path d="M98 10 Q92 6 88 10" stroke="#ec4899" strokeWidth="3" fill="#ec4899" />
                          <path d="M2 10 C-5 10 -7 6 -7 6" stroke="#ec4899" strokeWidth="2" />
                          <path d="M98 10 C105 10 107 6 107 6" stroke="#ec4899" strokeWidth="2" />
                        </svg>
                      )}
                      {selectedGlass === 'Browline' && (
                        <svg className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 12 Q24 9 40 14" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
                          <path d="M96 12 Q76 9 60 14" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
                          <path d="M4 12 Q14 28 40 28" stroke="#374151" strokeWidth="2.5" fill="rgba(255,255,255,0.05)" />
                          <path d="M96 12 Q86 28 60 28" stroke="#374151" strokeWidth="2.5" fill="rgba(255,255,255,0.05)" />
                          <path d="M40 14 Q50 12 60 14" stroke="#374151" strokeWidth="4" />
                          <path d="M4 12 C-3 12 -5 8 -5 8" stroke="#374151" strokeWidth="2" />
                          <path d="M96 12 C103 12 105 8 105 8" stroke="#374151" strokeWidth="2" />
                        </svg>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Sliders điều khiển kích thước / góc xoay của kính thử */}
                {uploadState === 'done' && selectedGlass && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                      <span>🕶️ Virtual Try-On Controls</span>
                      <span className="text-[var(--color-primary-light)]">Drag to place on your eyes</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Scale Slider */}
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[var(--color-muted)] w-10 text-left">Size</span>
                        <input 
                          type="range" 
                          min="0.5" 
                          max="2.0" 
                          step="0.05"
                          value={glassScale}
                          onChange={(e) => setGlassScale(parseFloat(e.target.value))}
                          className="flex-1 accent-[var(--color-primary)] h-1 rounded-lg bg-white/[0.08] cursor-pointer"
                        />
                        <span className="text-[11px] text-[var(--color-foreground)] font-mono w-8">{Math.round(glassScale * 100)}%</span>
                      </div>

                      {/* Rotate Slider */}
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[var(--color-muted)] w-10 text-left">Angle</span>
                        <input 
                          type="range" 
                          min="-45" 
                          max="45" 
                          step="1"
                          value={glassRotate}
                          onChange={(e) => setGlassRotate(parseInt(e.target.value))}
                          className="flex-1 accent-[var(--color-primary)] h-1 rounded-lg bg-white/[0.08] cursor-pointer"
                        />
                        <span className="text-[11px] text-[var(--color-foreground)] font-mono w-8">{glassRotate}°</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isLoading && uploadState !== 'done' && (
                  <button
                    onClick={onReset}
                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-black/60 border border-white/[0.08] text-white hover:bg-black/80 hover:scale-105 active:scale-95 transition-all duration-200 z-30"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--color-background)]/75 backdrop-blur-sm rounded-2xl z-10">
                    <div className="relative mt-24">
                      <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin" aria-hidden="true" />
                      <div className="absolute inset-0 w-10 h-10 rounded-full bg-[var(--color-primary)] opacity-20 blur-lg" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-foreground)] font-mono tracking-wide">
                      {uploadState === 'uploading' ? t('upload.state_uploading') : t('upload.state_analyzing')}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Model Selector dropdown (Show only before analyze is done) */}
          {imagePreviewUrl && !isLoading && uploadState !== 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04]"
            >
              <label className="block text-[11px] font-bold tracking-[0.16em] uppercase text-[var(--color-muted)] mb-3">
                {t('model_selector.title', 'Chọn Mô Hình AI để phân tích')}
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {MODELS_LIST.map((m) => {
                  const isSelected = selectedModel === m.id
                  const backendStatus = models.find((x) => x.name === m.id || (m.id === 'SVM' && x.name === 'SVM'))?.status
                  const isReady = backendStatus === 'Ready'

                  return (
                    <button
                      key={m.id}
                      type="button"
                      disabled={!isReady}
                      onClick={() => onModelChange(m.id)}
                      className={cn(
                        "flex flex-col items-start text-left p-3 rounded-xl border transition-all duration-200 select-none relative overflow-hidden",
                        !isReady && "opacity-40 cursor-not-allowed border-white/[0.02] bg-white/[0.01]",
                        isReady && isSelected && "bg-[var(--color-primary)]/[0.08] border-[var(--color-primary)]/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]",
                        isReady && !isSelected && "bg-transparent border-white/[0.04] hover:bg-white/[0.02] hover:border-white/[0.08]"
                      )}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={cn(
                          "text-[13px] font-bold", 
                          isReady && isSelected ? "text-[var(--color-primary-light)]" : "text-[var(--color-foreground)]",
                          !isReady && "text-[var(--color-muted)]"
                        )}>
                          {m.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                            isReady 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          )}>
                            {isReady ? t('model_selector.active', 'Active') : t('model_selector.coming_soon', 'Coming Soon')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full text-[10px] text-[var(--color-muted)]">
                        <span className="truncate max-w-[120px]">{m.desc}</span>
                        <span>{m.acc} Acc</span>
                      </div>
                    </button>
                  )
                })}
              </div>
              <p className="text-[10px] text-[var(--color-muted)] leading-relaxed italic">
                💡 {t('model_selector.note', 'Chỉ những mô hình nhãn "Active" mới sẵn sàng phân tích. Các mô hình "Đang phát triển" hiện được khóa.')}
              </p>
            </motion.div>
          )}

          {/* Error */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                role="alert"
                className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-500/[0.09] border border-red-500/20"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-[13px] text-red-300 leading-snug">{errorMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Done */}
          <AnimatePresence>
            {uploadState === 'done' && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                role="status"
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-500/[0.09] border border-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <p className="text-[13px] text-emerald-300">{t('upload.state_success')}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            {imagePreviewUrl && !isLoading && uploadState !== 'done' && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onAnalyze}
                className="btn-primary flex-1 justify-center"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                {t('upload.analyse_cta')}
              </motion.button>
            )}
            {(imagePreviewUrl || uploadState === 'error') && !isLoading && (
              <button
                onClick={onReset}
                className={cn(
                  'btn-ghost',
                  uploadState === 'done' ? 'flex-1 justify-center' : 'px-4',
                )}
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                {uploadState === 'done' ? t('results.reset') : 'Reset'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
