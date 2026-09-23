import { useEffect, useRef } from 'react'

const labels = {
  top: '00 — INTRO',
  work: '01 — WORK',
  projects: '02 — PROJECTS',
  toolkit: '03 — TOOLKIT',
  about: '04 — ABOUT',
  certifications: '05 — CERTIFICATIONS',
  contact: '06 — CONTACT',
}

export function PageHud() {
  const progressRef = useRef(null)
  const scrollRef = useRef(null)
  const cursorRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const sections = [...document.querySelectorAll('main > section[id]')]
    let frame = 0
    let cursor = '0, 0'

    const update = () => {
      frame = 0
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0
      progressRef.current.style.transform = `scaleX(${progress})`
      scrollRef.current.textContent = progress.toFixed(2)
      cursorRef.current.textContent = cursor
      const threshold = (document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0) + 24
      let active = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= threshold) active = section
      }
      if (maxScroll > 0 && window.scrollY >= maxScroll - 2) active = sections.at(-1)
      sectionRef.current.textContent = labels[active?.id] || labels.top
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    const move = (event) => {
      if (event.pointerType === 'touch') return
      cursor = `${Math.round(event.clientX)}, ${Math.round(event.clientY)}`
      schedule()
    }
    const resize = new window.ResizeObserver(schedule)
    resize.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('pointermove', move, { passive: true })
    update()
    return () => {
      window.cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return (
    <>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <div className="page-hud" aria-hidden="true">
        <span>SCRL <b ref={scrollRef}>0.00</b></span>
        <span>CRSR <b ref={cursorRef}>0, 0</b></span>
        <span ref={sectionRef}>00 — INTRO</span>
        <span>THEME <b>■ #C3FFFC</b></span>
        <span>+05:30</span>
      </div>
    </>
  )
}
