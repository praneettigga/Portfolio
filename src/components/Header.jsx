import { useEffect, useState } from 'react'
import { navigation } from '../data/portfolio.js'

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Praneet Tigga, back to top">
        <span className="wordmark-dot">PORTFOLIO/2026</span>
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? '[ CLOSE ]' : '[ MENU ]'}
      </button>

      <nav id="primary-navigation" className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Primary navigation">
        {navigation.map((item, index) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            <span>0{index + 1}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="resume-link" href="#contact">
        Get in touch <span aria-hidden="true">↗</span>
      </a>
    </header>
  )
}
