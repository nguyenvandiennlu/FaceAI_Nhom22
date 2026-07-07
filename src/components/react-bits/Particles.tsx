import { useEffect, useRef } from 'react'

interface ParticlesProps {
  quantity?: number
  staticity?: number
  ease?: number
  refresh?: boolean
}

export default function Particles({
  quantity = 60, // Giới hạn 60 hạt để mượt mà 60 FPS không lag
  staticity = 30,
  ease = 50,
  refresh = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const circlesRef = useRef<any[]>([])
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1

  useEffect(() => {
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext('2d')
    }
    initCanvas()
    animate()
    window.addEventListener('resize', initCanvas)

    return () => {
      window.removeEventListener('resize', initCanvas)
    }
  }, [refresh])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        mouseRef.current.x = event.clientX - rect.left
        mouseRef.current.y = event.clientY - rect.top
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const initCanvas = () => {
    resizeCanvas()
    drawParticles()
  }

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && contextRef.current) {
      circlesRef.current = []
      canvasSizeRef.current.w = canvasContainerRef.current.offsetWidth
      canvasSizeRef.current.h = canvasContainerRef.current.offsetHeight
      canvasRef.current.width = canvasSizeRef.current.w * dpr
      canvasRef.current.height = canvasSizeRef.current.h * dpr
      canvasRef.current.style.width = `${canvasSizeRef.current.w}px`
      canvasRef.current.style.height = `${canvasSizeRef.current.h}px`
      contextRef.current.scale(dpr, dpr)
    }
  }

  const circleParams = () => {
    const x = Math.floor(Math.random() * canvasSizeRef.current.w)
    const y = Math.floor(Math.random() * canvasSizeRef.current.h)
    const translateX = 0
    const translateY = 0
    const pSize = Math.random() * 2 + 1
    const alpha = 0 // Bắt đầu mờ rồi hiện dần
    const targetAlpha = parseFloat((Math.random() * 0.4 + 0.15).toFixed(2)) // Độ mờ vừa phải
    const dx = (Math.random() - 0.5) * 0.25 // Chuyển động chậm tinh tế
    const dy = (Math.random() - 0.5) * 0.25
    // Màu đồng bộ tím/cyan ngẫu nhiên
    const color = Math.random() > 0.5 ? '129, 140, 248' : '34, 211, 238' // Indigo/Cyan RGB
    return { x, y, translateX, translateY, size: pSize, alpha, targetAlpha, dx, dy, color }
  }

  const drawParticles = () => {
    for (let i = 0; i < quantity; i++) {
      circlesRef.current.push(circleParams())
    }
  }

  const animate = () => {
    if (contextRef.current) {
      contextRef.current.clearRect(0, 0, canvasSizeRef.current.w, canvasSizeRef.current.h)
      
      const circles = circlesRef.current
      const len = circles.length

      for (let i = 0; i < len; i++) {
        const c = circles[i]
        
        // Cập nhật vị trí hạt nhẹ nhàng
        c.x += c.dx
        c.y += c.dy

        // Đập biên thì quay đầu hoặc tái sinh ở biên đối diện
        if (c.x < 0) c.x = canvasSizeRef.current.w
        if (c.x > canvasSizeRef.current.w) c.x = 0
        if (c.y < 0) c.y = canvasSizeRef.current.h
        if (c.y > canvasSizeRef.current.h) c.y = 0

        // Hiệu ứng mờ dần (Fade in) ban đầu
        if (c.alpha < c.targetAlpha) {
          c.alpha += 0.01
        }

        // Tương tác đẩy nhẹ khi chuột ở gần
        const mouseDistance = Math.hypot(mouseRef.current.x - c.x, mouseRef.current.y - c.y)
        if (mouseDistance < 100) {
          const force = (100 - mouseDistance) / 100
          c.x += (c.x - mouseRef.current.x) * force * 0.02
          c.y += (c.y - mouseRef.current.y) * force * 0.02
        }

        // Vẽ hạt
        contextRef.current.beginPath()
        contextRef.current.arc(c.x, c.y, c.size, 0, 2 * Math.PI)
        contextRef.current.fillStyle = `rgba(${c.color}, ${c.alpha})`
        contextRef.current.fill()
      }

      // Vẽ liên kết giữa các hạt ở gần nhau
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const dist = Math.hypot(circles[i].x - circles[j].x, circles[i].y - circles[j].y)
          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.06 // Đường nối cực kỳ mờ, thanh thoát
            contextRef.current.beginPath()
            contextRef.current.moveTo(circles[i].x, circles[i].y)
            contextRef.current.lineTo(circles[j].x, circles[j].y)
            contextRef.current.strokeStyle = `rgba(129, 140, 248, ${alpha})`
            contextRef.current.lineWidth = 0.5
            contextRef.current.stroke()
          }
        }
      }
    }
    requestAnimationFrame(animate)
  }

  return (
    <div ref={canvasContainerRef} className="absolute inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
