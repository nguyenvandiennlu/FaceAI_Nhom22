import { useEffect, useState } from 'react'

interface DecryptedTextProps {
  text: string
  speed?: number
  maxIterations?: number
  className?: string
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 10,
  className = '',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    let iteration = 0

    const triggerDecrypt = () => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' '
              if (index < iteration / maxIterations) {
                return text[index]
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join(''),
        )

        if (iteration >= text.length * maxIterations) {
          clearInterval(interval)
          setDisplayText(text)
        }

        iteration++
      }, speed)
    }

    triggerDecrypt()

    return () => clearInterval(interval)
  }, [text, speed, maxIterations, isHovering])

  return (
    <span
      className={className}
      onMouseEnter={() => setIsHovering(!isHovering)}
      style={{ display: 'inline-block' }}
    >
      {displayText || text}
    </span>
  )
}
