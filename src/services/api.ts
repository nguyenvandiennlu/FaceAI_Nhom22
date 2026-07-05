import type { PredictionResponse, ModelInfo } from '@/types'

// ─── Base URL ──────────────────────────────────────────────────────────────────
// Update this to point to your FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const data = await res.json()
      message = data.detail ?? data.message ?? message
    } catch {
      // ignore json parse error
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

// ─── API Calls ─────────────────────────────────────────────────────────────────

/**
 * POST /predict
 * Sends an image file to the backend and returns face shape + eyewear recommendations.
 */
export async function predictFaceShape(imageFile: File, modelName: string = 'ResNet50'): Promise<PredictionResponse> {
  const formData = new FormData()
  formData.append('file', imageFile)
  formData.append('model_name', modelName)

  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  })

  return handleResponse<PredictionResponse>(res)
}

/**
 * GET /models
 * Fetches metadata and accuracy stats for all available ML models.
 */
export async function fetchModels(): Promise<ModelInfo[]> {
  const res = await fetch(`${API_BASE_URL}/models`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  return handleResponse<ModelInfo[]>(res)
}
