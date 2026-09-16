import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export function VariableName({ text, base, hover, className }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
      const letters = [...ref.current.querySelectorAll('.hero__letter')]
      const cleanups = letters.map((letter) => {
        const animate = (weight, duration) => gsap.to(letter, {
          fontVariationSettings: `"wght" ${weight}`,
          duration,
          ease: 'power2.out',
          overwrite: true,
        })
        const enter = () => animate(hover, 0.3)
        const leave = () => animate(base, 0.55)
        letter.addEventListener('pointerenter', enter)
        letter.addEventListener('pointerleave', leave)
        return () => {
          letter.removeEventListener('pointerenter', enter)
          letter.removeEventListener('pointerleave', leave)
          gsap.killTweensOf(letter)
          letter.style.fontVariationSettings = `"wght" ${base}`
        }
      })
      return () => cleanups.forEach(cleanup => cleanup())
    })
    return () => media.revert()
  }, [base, hover])

  return (
    <span ref={ref} className={className} aria-hidden="true">
      {[...text].map((letter, index) => (
        <span className="hero__letter" key={index} style={{ fontVariationSettings: `"wght" ${base}` }}>
          {letter}
        </span>
      ))}
    </span>
  )
}
