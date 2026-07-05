import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, ImageIcon, Loader2, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react'
import type { UploadState } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  uploadState: UploadState
  imagePreviewUrl: string | null
  errorMessage: string | null
  onFileSelect: (file: File) => void
  onAnalyze: () => void
  onReset: () => void
}

export default function UploadSection({
  uploadState,
  imagePreviewUrl,
  errorMessage,
  onFileSelect,
  onAnalyze,
  onReset,
}: Props) {
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
            Get started
          </p>
          <h2
            className="font-black tracking-[-0.03em] text-balance mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            Upload your photo
          </h2>
          <p className="text-[15px] text-[var(--color-muted)] max-w-md mx-auto leading-relaxed">
            Use a clear, well-lit frontal photo for best results. Your image is processed privately
            and never stored.
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
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}
                  >
                    <ImageIcon className="w-7 h-7 text-[var(--color-primary-light)]" aria-hidden="true" />
                  </div>
                  {isDragging && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -inset-2 rounded-3xl border border-[var(--color-primary)]/40 pointer-events-none"
                    />
                  )}
                </div>

                <div className="text-center px-4">
                  <p className="text-[15px] font-semibold text-[var(--color-foreground)] mb-1.5">
                    {isDragging ? 'Drop your photo here' : 'Drag & drop your photo'}
                  </p>
                  <p className="text-[13px] text-[var(--color-muted)]">
                    or{' '}
                    <span className="text-[var(--color-primary-light)] hover:underline">browse files</span>
                    {' '}— JPEG, PNG, WebP
                  </p>
                </div>
                <p className="text-[11px] text-[var(--color-muted-2)]">
                  Max 10 MB · Frontal face recommended
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <img
                  src={imagePreviewUrl}
                  alt="Preview of uploaded face photo"
                  className="w-full max-h-80 object-contain rounded-2xl bg-[var(--color-surface)]"
                />
                {!isLoading && (
                  <button
                    onClick={onReset}
                    aria-label="Remove photo"
                    className="absolute top-3 right-3 w-8 h-8 rounded-xl glass flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-white/10 transition-all"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--color-background)]/75 backdrop-blur-sm rounded-2xl">
                    <div className="relative">
                      <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin" aria-hidden="true" />
                      <div className="absolute inset-0 w-10 h-10 rounded-full bg-[var(--color-primary)] opacity-20 blur-lg" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">
                      {uploadState === 'uploading' ? 'Uploading…' : 'Analysing with AI…'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

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
                <p className="text-[13px] text-emerald-300">Analysis complete — scroll down to see your results.</p>
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
                Analyse face shape
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
                {uploadState === 'done' ? 'Try another photo' : 'Reset'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
