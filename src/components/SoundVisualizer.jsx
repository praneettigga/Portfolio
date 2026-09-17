import { useEffect, useRef } from 'react'

// A silent, generative visualization — no audio playback or microphone access.
export function SoundVisualizer() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return undefined
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let visible = false
    let size = 0
    let time = 0
    let previous = 0

    const draw = () => {
      const ctx = context
      const center = size / 2
      const radius = size * 0.32
      ctx.clearRect(0, 0, size, size)
      ctx.save()
      ctx.translate(center, center)

      // Quiet grooves anchor the moving spectrum.
      for (let ring = 0; ring < 5; ring += 1) {
        ctx.beginPath()
        ctx.arc(0, 0, size * (0.19 + ring * 0.066), 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(239,238,233,0.09)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Three outward-travelling wavefronts.
      for (let ring = 0; ring < 3; ring += 1) {
        const phase = (time * 0.12 + ring / 3) % 1
        ctx.beginPath()
        ctx.arc(0, 0, size * (0.18 + phase * 0.29), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(195,255,252,${(1 - phase) * 0.17})`
        ctx.stroke()
      }

      // A circular equalizer with layered, smoothly changing frequencies.
      for (let bar = 0; bar < 120; bar += 1) {
        const angle = bar / 120 * Math.PI * 2
        const energy = (Math.sin(angle * 5 + time * 1.7) + Math.sin(angle * 9 - time * 2.1) + 2) / 4
        const length = size * (0.012 + energy ** 2 * 0.105)
        ctx.save()
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.moveTo(radius, 0)
        ctx.lineTo(radius + length, 0)
        ctx.strokeStyle = bar % 5 === 0 ? 'rgba(195,255,252,0.9)' : `rgba(239,238,233,${0.22 + energy * 0.5})`
        ctx.lineWidth = Math.max(1, size * 0.003)
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.restore()
      }

      // Oscilloscope traces float through the center of the record.
      for (let trace = 0; trace < 3; trace += 1) {
        ctx.beginPath()
        for (let step = 0; step <= 180; step += 1) {
          const progress = step / 180
          const x = (progress - 0.5) * size * 0.51
          const envelope = Math.sin(progress * Math.PI) ** 2
          const y = envelope * size * 0.055 * (
            Math.sin(progress * Math.PI * 8 - time * 2.6 + trace * 0.5) +
            0.45 * Math.sin(progress * Math.PI * 18 + time * 1.4)
          )
          if (step === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = trace === 0 ? 'rgba(195,255,252,0.95)' : `rgba(195,255,252,${0.22 / trace})`
        ctx.lineWidth = trace === 0 ? 1.5 : 1
        ctx.stroke()
      }
      ctx.restore()
    }

    const tick = (now) => {
      if (now - previous >= 1000 / 30) {
        time += Math.min((now - previous) / 1000, 0.05)
        previous = now
        draw()
      }
      frame = window.requestAnimationFrame(tick)
    }
    const sync = () => {
      window.cancelAnimationFrame(frame)
      draw()
      if (visible && !document.hidden && !motion.matches) {
        previous = window.performance.now()
        frame = window.requestAnimationFrame(tick)
      }
    }
    const resize = new window.ResizeObserver(() => {
      size = canvas.getBoundingClientRect().width
      const scale = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(size * scale)
      canvas.height = Math.round(size * scale)
      context.setTransform(scale, 0, 0, scale, 0, 0)
      draw()
    })
    const intersection = new window.IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    resize.observe(canvas)
    intersection.observe(canvas)
    motion.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      window.cancelAnimationFrame(frame)
      resize.disconnect()
      intersection.disconnect()
      motion.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return (
    <div className="sound-visualizer" aria-hidden="true">
      <canvas ref={canvasRef} />
      <span className="sound-visualizer__label">SOUND / IN MOTION</span>
    </div>
  )
}
