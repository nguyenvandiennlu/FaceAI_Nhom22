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
}: Props) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative rounded-2xl border border-white/[0.08] overflow-hidden bg-black/25 flex items-center justify-center min-h-[350px]"
              >
                <img
                  src={imagePreviewUrl}
                  alt="Face shape preview"
                  className="max-h-[420px] w-auto object-contain select-none"
                />
                {!isLoading && uploadState !== 'done' && (
                  <button
                    onClick={onReset}
                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-black/60 border border-white/[0.08] text-white hover:bg-black/80 hover:scale-105 active:scale-95 transition-all duration-200"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--color-background)]/75 backdrop-blur-sm rounded-2xl">
                    <div className="relative">
                      <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin" aria-hidden="true" />
                      <div className="absolute inset-0 w-10 h-10 rounded-full bg-[var(--color-primary)] opacity-20 blur-lg" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">
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
