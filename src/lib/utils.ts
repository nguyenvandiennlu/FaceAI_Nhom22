import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function getSpeedColor(speed: string): string {
  switch (speed) {
    case 'Very Fast': return 'text-green-400'
    case 'Fast': return 'text-cyan-400'
    case 'Medium': return 'text-yellow-400'
    case 'Slow': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.95) return 'Very High'
  if (confidence >= 0.85) return 'High'
  if (confidence >= 0.70) return 'Moderate'
  return 'Low'
}
