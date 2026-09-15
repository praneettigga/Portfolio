import { useEffect, useRef } from 'react'

const bayer8 = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21],
]

const hash = (x, y) => {
  let value = (x * 374761393 + y * 668265263) | 0
  value = (value ^ (value >> 13)) * 1274126177
  return ((value ^ (value >> 16)) >>> 0) / 4294967295
}

export function InteractivePixelField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = canvas?.closest('.hero')
    const context = canvas?.getContext('2d')

    if (!canvas || !hero || !context) return undefined

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = motionQuery.matches
    const portrait = hero.querySelector('.portrait-wrap')
    const portraitImage = hero.querySelector('.portrait__image')
    const portraitCanvas = hero.querySelector('.portrait__pixels')
    const portraitContext = portraitCanvas?.getContext('2d')
    let portraitSource = null
    let portraitPixels = null
    const preparePortrait = () => {
      if (!portraitContext || !portraitImage.naturalWidth) return
      portraitCanvas.width = Math.round(portraitImage.naturalWidth / 4)
      portraitCanvas.height = Math.round(portraitImage.naturalHeight / 4)
      portraitContext.drawImage(portraitImage, 0, 0, portraitCanvas.width, portraitCanvas.height)
      portraitSource = portraitContext.getImageData(0, 0, portraitCanvas.width, portraitCanvas.height)
      portraitPixels = portraitContext.createImageData(portraitCanvas.width, portraitCanvas.height)
      portraitContext.clearRect(0, 0, portraitCanvas.width, portraitCanvas.height)
    }
    portraitImage?.addEventListener('load', preparePortrait)
    if (portraitImage?.complete) preparePortrait()
    const name = hero.querySelector('.hero__name')
    const reticle = hero.querySelector('.cursor-reticle')
    const hudValue = hero.querySelector('[data-cursor-value]')
    const pointer = { x: -10000, y: -10000, nx: 0.5, ny: 0.5 }
    const eased = { x: 0.5, y: 0.5 }
    let columns = 0
    let rows = 0
    let pixels = null
    let animationFrame = 0
    let stopped = false
    let visible = true
    let lastFrame = 0
    let clock = 0
    let width = 1
    let height = 1
    let trail = []

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width || 1
      height = bounds.height || 1
      columns = Math.max(1, Math.ceil(bounds.width / 7))
      rows = Math.max(1, Math.ceil(bounds.height / 7))
      canvas.width = columns
      canvas.height = rows
      pixels = context.createImageData(columns, rows)
      if (reducedMotion) render()
    }

    const render = (time = 0) => {
      if (!pixels) return

      const data = pixels.data
      const tick = time * 0.0007
      const cursorX = pointer.x / width * columns
      const cursorY = pointer.y / height * rows
      const breath = Math.sin(tick * 0.65) * 0.065
      trail = trail.filter(point => time - point.time < 1800)

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          const index = (y * columns + x) * 4
          const flowX = x + 9 * Math.sin(y * 0.045 + tick)
          const flowY = y + 11 * Math.cos(x * 0.035 - tick * 0.8)
          const waveA = Math.sin(flowX * 0.072 + tick * 1.2)
          const waveB = Math.sin(flowY * 0.087 - tick * 0.85)
          const waveC = Math.sin((flowX + flowY) * 0.048 + tick * 0.7)
          let energy = ((waveA + waveB + waveC) / 3) * 0.39 + 0.25 + breath
          let wake = 0
          for (const point of trail) {
            const dx = x - point.x * columns
            const dy = y - point.y * rows
            const age = (time - point.time) / 1800
            const radius = 9 + age * 22
            const distance = Math.sqrt(dx * dx + dy * dy)
            wake += Math.max(0, 1 - Math.abs(distance - radius) / 5) * (1 - age) * 0.09
          }
          energy += Math.min(0.3, wake)

          const deltaX = x - cursorX
          const deltaY = y - cursorY
          const distanceSquared = deltaX * deltaX + deltaY * deltaY
          if (distanceSquared < 1250) {
            energy += (1 - distanceSquared / 1250) * 0.62
          }

          const orderedNoise = bayer8[y & 7][x & 7] / 64 - 0.5
          const randomNoise = hash(x, y) - 0.5
          const value = energy + orderedNoise * 0.28 + randomNoise * 0.12

          let shade = 0
          let alpha = 0
          if (value > 0.7) {
            shade = 170
            alpha = 210
          } else if (value > 0.5) {
            shade = 105
            alpha = 175
          } else if (value > 0.34) {
            shade = 58
            alpha = 145
          } else if (value > 0.22) {
            shade = 30
            alpha = 105
          }

          const nearCursor = distanceSquared < 155 || wake > 0.075
          data[index] = nearCursor ? Math.min(195, shade + 12) : shade
          data[index + 1] = nearCursor ? Math.min(255, shade + 45) : shade
          data[index + 2] = nearCursor ? Math.min(252, shade + 43) : shade
          data[index + 3] = alpha
        }
      }

      context.putImageData(pixels, 0, 0)

      // A low-opacity pixel layer follows the exact portrait silhouette.
      // Slow, offset waves change individual clusters without moving facial features.
      if (portraitSource && portraitPixels) {
        const source = portraitSource.data
        const target = portraitPixels.data
        const portraitWidth = portraitCanvas.width
        for (let i = 0; i < source.length; i += 4) {
          const x = (i / 4) % portraitWidth
          const y = Math.floor(i / 4 / portraitWidth)
          const pulse = Math.sin(x * 0.055 + y * 0.027 + tick * 0.8)
            * Math.sin(y * 0.045 - tick * 0.55 + hash(x, y) * 2)
          const shade = pulse > 0 ? 225 : 0
          target[i] = shade
          target[i + 1] = shade
          target[i + 2] = shade
          target[i + 3] = reducedMotion ? 0 : Math.abs(pulse) * 0.19 * source[i + 3]
        }
        portraitContext.putImageData(portraitPixels, 0, 0)
      }

      eased.x += (pointer.nx - eased.x) * 0.065
      eased.y += (pointer.ny - eased.y) * 0.065
      if (portrait) {
        portrait.style.transform = reducedMotion ? '' : `translate3d(${(eased.x - 0.5) * -18}px, ${(eased.y - 0.5) * -12 + Math.sin(tick * 0.7) * 4}px, 0)`
      }
      if (name) {
        name.style.transform = `translate3d(${(eased.x - 0.5) * 5}px, ${(eased.y - 0.5) * 3}px, 0)`
      }

    }

    const animate = (time) => {
      animationFrame = 0
      if (stopped || reducedMotion || !visible || document.hidden) return
      if (time - lastFrame >= 1000 / 30) {
        clock += Math.min(time - lastFrame, 50)
        lastFrame = time
        render(clock)
      }
      animationFrame = window.requestAnimationFrame(animate)
    }
    const resume = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
      lastFrame = window.performance.now()
      if (!stopped && !reducedMotion && visible && !document.hidden) {
        animationFrame = window.requestAnimationFrame(animate)
      }
    }

    const move = (event) => {
      if (event.pointerType === 'touch' || reducedMotion) return

      const bounds = hero.getBoundingClientRect()
      const fieldBounds = canvas.getBoundingClientRect()
      pointer.x = event.clientX - fieldBounds.left
      pointer.y = event.clientY - fieldBounds.top
      pointer.nx = Math.min(1, Math.max(0, pointer.x / bounds.width))
      pointer.ny = Math.min(1, Math.max(0, pointer.y / bounds.height))

      if (hudValue) hudValue.textContent = `${Math.round(event.clientX)}.${Math.round(event.clientY)}`
      if (reticle) {
        reticle.style.opacity = '1'
        reticle.style.transform = `translate3d(${event.clientX - bounds.left}px, ${event.clientY - bounds.top}px, 0)`
      }

      if (!trail.length || clock - trail[trail.length - 1].time > 90) {
        trail.push({ x: pointer.x / width, y: pointer.y / height, time: clock })
        trail = trail.slice(-12)
      }
    }

    const leave = () => {
      pointer.x = -10000
      pointer.y = -10000
      pointer.nx = 0.5
      pointer.ny = 0.5
      if (reticle) reticle.style.opacity = '0'
    }

    resize()
    render(0)

    const observer = new window.ResizeObserver(resize)
    observer.observe(canvas)

    const visibilityObserver = new window.IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      resume()
    })
    visibilityObserver.observe(hero)
    const changeMotion = () => {
      reducedMotion = motionQuery.matches
      leave()
      trail = []
      resume()
      if (reducedMotion) render(0)
    }
    motionQuery.addEventListener('change', changeMotion)
    document.addEventListener('visibilitychange', resume)
    hero.addEventListener('pointermove', move, { passive: true })
    hero.addEventListener('pointerleave', leave)
    resume()

    return () => {
      stopped = true
      portraitImage?.removeEventListener('load', preparePortrait)
      portraitContext?.clearRect(0, 0, portraitCanvas.width, portraitCanvas.height)
      observer.disconnect()
      visibilityObserver.disconnect()
      motionQuery.removeEventListener('change', changeMotion)
      document.removeEventListener('visibilitychange', resume)
      window.cancelAnimationFrame(animationFrame)
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
      if (portrait) portrait.style.transform = ''
      if (portrait) portrait.style.filter = ''
      if (name) name.style.transform = ''
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__pixel-canvas" aria-hidden="true" />
}
