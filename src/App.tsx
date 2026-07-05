import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import UploadSection from '@/components/UploadSection'
import PredictionDashboard from '@/components/PredictionDashboard'
import ModelComparison from '@/components/ModelComparison'
import RecommendationCards from '@/components/RecommendationCards'
import Pipeline from '@/components/Pipeline'
import CTA from '@/components/CTA'
import type { AppState, ModelInfo, PredictionResponse } from '@/types'
import { MOCK_MODELS, MOCK_PREDICTION } from '@/types'
import { predictFaceShape, fetchModels } from '@/services/api'


// ─── Dev flag ────────────────────────────────────────────────────────────────
// Set VITE_USE_MOCK=false in .env to connect a live backend; defaults to true for preview.
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const initialState: AppState = {
  uploadState: 'idle',
  imageFile: null,
  imagePreviewUrl: null,
  prediction: null,
  models: [],
  errorMessage: null,
}

export default function App() {
  const { t } = useTranslation()
  const [state, setState] = useState<AppState>(initialState)
  const [selectedModel, setSelectedModel] = useState<string>('ResNet50')
  const resultsRef = useRef<HTMLDivElement>(null)

  // Fetch models on mount
  useEffect(() => {
    async function loadModels() {
      if (USE_MOCK) {
        setState((s) => ({ ...s, models: MOCK_MODELS }))
        return
      }
      try {
        const data: ModelInfo[] = await fetchModels()
        setState((s) => ({ ...s, models: data }))
      } catch {
        // Fall back to mock data silently if backend is unavailable
        setState((s) => ({ ...s, models: MOCK_MODELS }))
      }
    }
    loadModels()
  }, [])

  const handleFileSelect = (file: File) => {
    if (state.imagePreviewUrl) {
      URL.revokeObjectURL(state.imagePreviewUrl)
    }
    const url = URL.createObjectURL(file)
    setState((s) => ({
      ...s,
      imageFile: file,
      imagePreviewUrl: url,
      uploadState: 'idle',
      prediction: null,
      errorMessage: null,
    }))
  }

  const handleAnalyze = async () => {
    if (!state.imageFile) return

    setState((s) => ({ ...s, uploadState: 'analyzing', errorMessage: null }))

    if (USE_MOCK) {
      // Simulate network latency for design preview
      await new Promise((resolve) => setTimeout(resolve, 1600))
      setState((s) => ({
        ...s,
        uploadState: 'done',
        prediction: {
          ...MOCK_PREDICTION,
          best_model: `${selectedModel} (Mock Mode)`
        },
      }))
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      return
    }

    try {
      const prediction: PredictionResponse = await predictFaceShape(state.imageFile, selectedModel)
      setState((s) => ({ ...s, uploadState: 'done', prediction }))
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setState((s) => ({ ...s, uploadState: 'error', errorMessage: message }))
    }
  }

  const handleReset = () => {
    if (state.imagePreviewUrl) URL.revokeObjectURL(state.imagePreviewUrl)
    setState((s) => ({
      ...s,
      uploadState: 'idle',
      imageFile: null,
      imagePreviewUrl: null,
      prediction: null,
      errorMessage: null,
    }))
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans">
      <Navbar />

      <main>
        <Hero />
        <HowItWorks />

        <UploadSection
          uploadState={state.uploadState}
          imagePreviewUrl={state.imagePreviewUrl}
          errorMessage={state.errorMessage}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          models={state.models}
          onFileSelect={handleFileSelect}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
        />

        {/* Results area */}
        <div ref={resultsRef}>
          <AnimatePresence>
            {state.prediction && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <PredictionDashboard prediction={state.prediction} />
                <RecommendationCards
                  recommendations={state.prediction.recommendations}
                  faceShape={state.prediction.face_shape}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ModelComparison */}
        <ModelComparison
          models={state.models.length > 0 ? state.models : MOCK_MODELS}
          bestModel={state.prediction?.best_model}
        />
        <Pipeline />
        <CTA />

      </main>

      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-muted)]">
            {t('footer.title')}
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            {t('footer.tech')}
          </p>
        </div>
      </footer>
    </div>
  )
}
