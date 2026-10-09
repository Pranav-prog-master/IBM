import { useEffect, useRef, useCallback } from 'react'

export function useScratchpad(canvasRef) {
  const drawing = useRef(false)
  const strokes = useRef([])
  const current = useRef([])

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const dpr  = window.devicePixelRatio || 1
    const src  = e.touches ? e.touches[0] : e
    return {
      x: (src.clientX - rect.left) * dpr,
      y: (src.clientY - rect.top)  * dpr,
    }
  }

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth   = 2 * dpr
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
    ctx.strokeStyle = '#1B2B34'
    strokes.current.forEach(pts => {
      if (pts.length < 2) return
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
      ctx.stroke()
    })
  }, [canvasRef])

  const setup = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvas.parentElement) return
    const dpr = window.devicePixelRatio || 1
    const W   = canvas.parentElement.offsetWidth || 200
    const H   = 160
    canvas.width        = W * dpr
    canvas.height       = H * dpr
    canvas.style.width  = `${W}px`
    canvas.style.height = `${H}px`
    redraw()
  }, [canvasRef, redraw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    setup()

    const start = (e) => {
      e.preventDefault()
      drawing.current = true
      current.current = [getPos(e, canvas)]
    }

    const move = (e) => {
      e.preventDefault()
      if (!drawing.current) return
      const pos = getPos(e, canvas)
      current.current.push(pos)
      const pts = current.current
      if (pts.length < 2) return
      const ctx = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1
      ctx.lineWidth   = 2 * dpr
      ctx.lineCap     = 'round'
      ctx.lineJoin    = 'round'
      ctx.strokeStyle = '#1B2B34'
      ctx.beginPath()
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }

    const end = () => {
      if (!drawing.current) return
      drawing.current = false
      if (current.current.length > 1) {
        strokes.current = [...strokes.current, [...current.current]]
      }
      current.current = []
    }

    canvas.addEventListener('mousedown',  start)
    canvas.addEventListener('mousemove',  move)
    canvas.addEventListener('mouseup',    end)
    canvas.addEventListener('mouseleave', end)
    canvas.addEventListener('touchstart', start, { passive: false })
    canvas.addEventListener('touchmove',  move,  { passive: false })
    canvas.addEventListener('touchend',   end)

    let ro = null
    if (canvas.parentElement) {
      ro = new ResizeObserver(setup)
      ro.observe(canvas.parentElement)
    }

    return () => {
      canvas.removeEventListener('mousedown',  start)
      canvas.removeEventListener('mousemove',  move)
      canvas.removeEventListener('mouseup',    end)
      canvas.removeEventListener('mouseleave', end)
      canvas.removeEventListener('touchstart', start)
      canvas.removeEventListener('touchmove',  move)
      canvas.removeEventListener('touchend',   end)
      if (ro) ro.disconnect()
    }
  }, [setup]) // canvasRef is stable — intentionally excluded

  const undo = useCallback(() => {
    strokes.current = strokes.current.slice(0, -1)
    redraw()
  }, [redraw])

  const clear = useCallback(() => {
    strokes.current = []
    redraw()
  }, [redraw])

  return { undo, clear }
}
