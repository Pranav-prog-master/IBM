import { useEffect } from 'react'

const PRIMARY = '#1F4D3A'
const ACCENT  = '#F4B400'
const TRACK   = '#D4DDD9'
const INK_MUT = '#4A6572'
const DAYS    = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/* Polyfill roundRect for browsers that don't support it */
function roundRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r)
  } else {
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }
}

function draw(canvas, streakDays, todayIdx) {
  const dpr  = window.devicePixelRatio || 1
  const W    = canvas.offsetWidth || canvas.parentElement?.offsetWidth || 300
  const H    = 80

  canvas.width        = W * dpr
  canvas.height       = H * dpr
  canvas.style.width  = `${W}px`
  canvas.style.height = `${H}px`

  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const n      = DAYS.length
  const barW   = 24
  const gap    = (W - n * barW) / (n + 1)
  const maxBarH = H - 28

  DAYS.forEach((day, i) => {
    const x       = gap + i * (barW + gap)
    const active  = streakDays[i]
    const isToday = i === todayIdx

    // Track bar
    ctx.beginPath()
    roundRect(ctx, x, 8, barW, maxBarH, 6)
    ctx.fillStyle = TRACK
    ctx.fill()

    // Active fill
    if (active) {
      ctx.beginPath()
      roundRect(ctx, x, 8, barW, maxBarH, 6)
      ctx.fillStyle = isToday ? ACCENT : PRIMARY
      ctx.fill()
    }

    // Today ring
    if (isToday) {
      ctx.beginPath()
      roundRect(ctx, x - 2, 6, barW + 4, maxBarH + 4, 8)
      ctx.strokeStyle = PRIMARY
      ctx.lineWidth   = 2
      ctx.stroke()
    }

    // Day label
    ctx.fillStyle  = INK_MUT
    ctx.font       = '700 10px Nunito, sans-serif'
    ctx.textAlign  = 'center'
    ctx.fillText(day, x + barW / 2, H - 4)
  })
}

export function useStreakChart(canvasRef, streakDays, todayIdx) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Draw immediately (may be 0-width on first paint)
    draw(canvas, streakDays, todayIdx)

    // Redraw once layout is complete via ResizeObserver
    const ro = new ResizeObserver(() => draw(canvas, streakDays, todayIdx))
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    return () => ro.disconnect()
  }, [streakDays, todayIdx]) // canvasRef is stable — intentionally excluded
}
