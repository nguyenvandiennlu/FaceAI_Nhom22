import { useEffect, useRef } from 'react'

export default function FaceMesh3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = 350
    let height = 350
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }
    resize()

    // ─── TẠO TỌA ĐỘ 3D CHO MẶT NẠ NGƯỜI (FACE MESH) ───
    const points: { x: number; y: number; z: number }[] = []
    const uSegments = 16
    const vSegments = 16

    for (let i = 0; i <= uSegments; i++) {
      const u = (i / uSegments) * Math.PI // 0 đến PI
      for (let j = 0; j <= vSegments; j++) {
        const v = (j / vSegments) * Math.PI * 2 // 0 đến 2PI
        
        // Tạo hình bán cầu lồi ở mặt trước (giả lập khuôn mặt)
        let r = 90
        
        // Biến dạng hình bán cầu để tạo dáng mặt thuôn oval
        let x = r * Math.sin(u) * Math.cos(v) * 0.95
        let y = r * Math.cos(u) * 1.3 // Dáng dài oval
        let z = r * Math.sin(u) * Math.sin(v)

        // Chỉ giữ lại nửa mặt trước (z >= -20) để làm mặt nạ
        if (z >= -20) {
          // Tạo sống mũi lồi nhẹ ở giữa mặt
          if (Math.abs(x) < 25 && y > -40 && y < 20) {
            z += (25 - Math.abs(x)) * 0.35
          }
          // Tạo hốc mắt lõm nhẹ hai bên
          if (Math.abs(x) > 25 && Math.abs(x) < 55 && y > 10 && y < 40) {
            z -= 8
          }
          // Tạo cằm nhọn nhẹ phía dưới
          if (y < -70) {
            x *= 0.8
          }
          points.push({ x, y, z })
        }
      }
    }

    // Kết nối các điểm lân cận thành lưới tam giác/tứ giác
    const connections: [number, number][] = []
    const threshold = 28 // Khoảng cách tối đa để nối các điểm thành lưới
    const len = points.length
    for (let i = 0; i < len; i++) {
      let count = 0
      for (let j = i + 1; j < len; j++) {
        const dist = Math.hypot(
          points[i].x - points[j].x,
          points[i].y - points[j].y,
          points[i].z - points[j].z
        )
        if (dist < threshold && count < 3) {
          connections.push([i, j])
          count++
        }
      }
    }

    // Góc quay hiện tại
    let angleY = 0
    let angleX = 0

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Giới hạn góc quay theo tọa độ chuột
      mouseRef.current.targetX = ((e.clientX - centerX) / (rect.width / 2)) * 0.4
      mouseRef.current.targetY = ((e.clientY - centerY) / (rect.height / 2)) * 0.3
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Biến cho đường quét Laser và Radar
    let laserY = 0
    let laserDirection = 1
    let radarRotation = 0

    // Hàm vẽ và cập nhật hoạt cảnh
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Lerp mượt mà góc quay theo chuột
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08

      // Góc tự quay chậm kết hợp góc xoay chuột
      angleY = mouseRef.current.x + Math.sin(Date.now() * 0.0008) * 0.15
      angleX = mouseRef.current.y + 0.1 // hơi ngửa lên

      const cosY = Math.cos(angleY)
      const sinY = Math.sin(angleY)
      const cosX = Math.cos(angleX)
      const sinX = Math.sin(angleX)

      // ─── 1. VẼ VÒNG TRÒN RADAR QUÉT (HUD RADAR RINGS) ───
      radarRotation += 0.005
      ctx.save()
      ctx.translate(width / 2, height / 2)
      
      // Vòng tròn ngoài nét đứt quay phải
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 15])
      ctx.beginPath()
      ctx.arc(0, 0, 155, 0, Math.PI * 2)
      ctx.stroke()

      // Vòng tròn giữa nét liền mỏng quay trái
      ctx.rotate(-radarRotation)
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.2)'
      ctx.setLineDash([40, 180])
      ctx.beginPath()
      ctx.arc(0, 0, 140, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      // ─── 2. PHÉP CHIẾU 3D FACE MESH ───
      const projected: { x: number; y: number; z: number }[] = []
      const fov = 400 // Tiêu cự camera giả lập
      const cameraDist = 280

      for (let i = 0; i < len; i++) {
        const p = points[i]

        // Xoay quanh trục Y
        let x1 = p.x * cosY - p.z * sinY
        let z1 = p.z * cosY + p.x * sinY

        // Xoay quanh trục X
        let y2 = p.y * cosX - z1 * sinX
        let z2 = z1 * cosX + p.y * sinX

        // Phép chiếu 3D Perspective Projection
        const scale = fov / (fov + z2 + cameraDist)
        const projX = x1 * scale + width / 2
        const projY = -y2 * scale + height / 2

        projected.push({ x: projX, y: projY, z: z2 })
      }

      // Vẽ các đường lưới liên kết (connections)
      ctx.lineWidth = 0.6
      for (const [i, j] of connections) {
        const p1 = projected[i]
        const p2 = projected[j]

        const avgZ = (p1.z + p2.z) / 2
        const alpha = Math.max(0.04, Math.min(0.3, 0.2 - (avgZ / 100)))
        const color = avgZ > 0 ? '129, 140, 248' : '34, 211, 238' // Indigo/Cyan

        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(${color}, ${alpha})`
        ctx.stroke()
      }

      // Vẽ các điểm nút hạt tròn nhỏ sáng lung linh ở các khớp lưới
      for (let i = 0; i < len; i++) {
        if (i % 2 === 0) {
          const p = projected[i]
          const alpha = Math.max(0.08, Math.min(0.5, 0.35 - (p.z / 100)))
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha})` // Cyan dot
          ctx.fill()
        }
      }

      // ─── 3. VẼ ĐƯỜNG LASER QUÉT NGANG (SCANNING LASER LINE) ───
      laserY += 1.2 * laserDirection
      if (laserY > 110 || laserY < -110) {
        laserDirection *= -1
      }
      
      const realLaserY = height / 2 + laserY
      const gradient = ctx.createLinearGradient(width / 2 - 120, realLaserY, width / 2 + 120, realLaserY)
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0)')
      gradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.45)') // Tia quét màu xanh ngọc rực sáng ở giữa
      gradient.addColorStop(1, 'rgba(34, 211, 238, 0)')

      ctx.strokeStyle = gradient
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(width / 2 - 125, realLaserY)
      ctx.lineTo(width / 2 + 125, realLaserY)
      ctx.stroke()

      // Đốm sáng nhỏ quét theo hai đầu của tia laser
      ctx.fillStyle = 'rgba(34, 211, 238, 0.4)'
      ctx.beginPath()
      ctx.arc(width / 2 - 125, realLaserY, 2.5, 0, Math.PI * 2)
      ctx.arc(width / 2 + 125, realLaserY, 2.5, 0, Math.PI * 2)
      ctx.fill()

      // ─── 4. VẼ KHUNG GÓC CAMERA NGẮM MỤC TIÊU (CORNER BRACKETS) ───
      const pad = 20
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)'
      ctx.lineWidth = 1.5
      
      // Góc trên bên trái
      ctx.beginPath()
      ctx.moveTo(pad, pad + 15)
      ctx.lineTo(pad, pad)
      ctx.lineTo(pad + 15, pad)
      ctx.stroke()

      // Góc trên bên phải
      ctx.beginPath()
      ctx.moveTo(width - pad, pad + 15)
      ctx.lineTo(width - pad, pad)
      ctx.lineTo(width - pad - 15, pad)
      ctx.stroke()

      // Góc dưới bên trái
      ctx.beginPath()
      ctx.moveTo(pad, height - pad - 15)
      ctx.lineTo(pad, height - pad)
      ctx.lineTo(pad + 15, height - pad)
      ctx.stroke()

      // Góc dưới bên phải
      ctx.beginPath()
      ctx.moveTo(width - pad, height - pad - 15)
      ctx.lineTo(width - pad, height - pad)
      ctx.lineTo(width - pad - 15, height - pad)
      ctx.stroke()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="w-[350px] h-[350px] flex items-center justify-center relative select-none pointer-events-none">
      {/* Glow background behind the mesh */}
      <div className="absolute w-[200px] h-[200px] rounded-full bg-[var(--color-primary)] opacity-10 blur-[80px] -z-10" />
      <canvas ref={canvasRef} />
    </div>
  )
}
