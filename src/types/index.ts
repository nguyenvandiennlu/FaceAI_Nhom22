// ─── API Response Types ────────────────────────────────────────────────────────

export interface FrameRecommendation {
  frame: string
  score: number
}

export interface PredictionResponse {
  face_shape: string
  confidence: number
  best_model: string
  recommendations: FrameRecommendation[]
}

export interface ModelInfo {
  name: string
  method?: string
  accuracy: number
  speed: string
  status: 'Ready' | 'Loading' | 'Error'
}

// ─── UI State Types ────────────────────────────────────────────────────────────

export type UploadState = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error'

export interface AppState {
  uploadState: UploadState
  imageFile: File | null
  imagePreviewUrl: string | null
  prediction: PredictionResponse | null
  models: ModelInfo[]
  errorMessage: string | null
}

// ─── Mock Data (design preview only — clearly separated from API logic) ────────

export const MOCK_PREDICTION: PredictionResponse = {
  face_shape: 'Oval',
  confidence: 0.96,
  best_model: 'EfficientNetV2',
  recommendations: [
    { frame: 'Round', score: 97 },
    { frame: 'Rectangle', score: 91 },
    { frame: 'Aviator', score: 88 },
  ],
}

export const MOCK_MODELS: ModelInfo[] = [
  { name: 'SVM', method: 'HOG + LinearSVC', accuracy: 89.4, speed: 'Very Fast', status: 'Ready' },
  { name: 'CNN', accuracy: 93.2, speed: 'Fast', status: 'Ready' },
  { name: 'ResNet50', accuracy: 95.7, speed: 'Medium', status: 'Ready' },
  { name: 'EfficientNetV2', accuracy: 96.8, speed: 'Fast', status: 'Ready' },
]

// ─── Frame metadata ────────────────────────────────────────────────────────────

export const FRAME_DETAILS: Record<string, { description: string; bestFor: string[] }> = {
  Round: {
    description: 'Soft circular frames that complement angular features and add gentle curves.',
    bestFor: ['Square faces', 'Oval faces', 'Diamond faces'],
  },
  Rectangle: {
    description: 'Bold, structured frames that add definition and a professional look.',
    bestFor: ['Oval faces', 'Round faces', 'Heart faces'],
  },
  Aviator: {
    description: 'Teardrop-shaped classics that balance proportions and suit most face shapes.',
    bestFor: ['Oval faces', 'Heart faces', 'Oblong faces'],
  },
  Wayfarer: {
    description: 'Iconic trapezoidal frames that add boldness and contrast.',
    bestFor: ['Oval faces', 'Square faces', 'Heart faces'],
  },
  'Cat-eye': {
    description: 'Upswept frames that highlight cheekbones and add a glamorous touch.',
    bestFor: ['Heart faces', 'Oval faces', 'Round faces'],
  },
  Browline: {
    description: 'Semi-rimless frames with a strong top bar that adds definition.',
    bestFor: ['Oval faces', 'Round faces', 'Diamond faces'],
  },
}
