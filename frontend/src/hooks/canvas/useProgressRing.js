import { useEffect, useRef } from 'react'

const PRIMARY = '#1F4D3A'
const TRACK   = '#D4DDD9'
const ACCENT  = '#F4B400'

export function useProgressRing(canvasRef, pct) {
  const rafRef     = useRef(null)
  const currentRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr  = window.devicePixelRatio || 1
    const SIZE = 160

    canvas.width        = SIZE * dpr
    canvas.height       = SIZE * dpr
    canvas.style.width  = `${SIZE}px`
    canvas.style.height = `${SIZE}px`

    const ctx    = canvas.getContext('2d')
    const cx     = (SIZE * dpr) / 2
    const cy     = (SIZE * dpr) / 2
    const r      = (SIZE / 2 - 14) * dpr
    const target = pct / 100

    const draw = (val) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 12 * dpr
      ctx.lineCap   = 'round'

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = TRACK
      ctx.stroke()

      if (val > 0) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * val)
        ctx.strokeStyle = val >= 1 ? ACCENT : PRIMARY
        ctx.stroke()
      }
    }

    const animate = () => {
      const diff = target - currentRef.current
      if (Math.abs(diff) < 0.002) {
        currentRef.current = target
        draw(target)
        return
      }
      currentRef.current += diff * 0.08
      draw(currentRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(rafRef.current)
  }, [pct]) // canvasRef is a stable ref object — intentionally excluded
}
