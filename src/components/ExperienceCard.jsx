import { useId, useLayoutEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function ExperienceCard({ item, index }) {
  const [expanded, setExpanded] = useState(false)
  const id = useId()
  const filterId = `${id}-logo`
  const panelId = `${id}-details`
  const logoFrames = [
    { viewBox: '44 119 360 208', width: 447, height: 447 },
    { viewBox: '730 254 542 580', width: 2000, height: 1088 },
    { viewBox: '154 85 476 159', width: 776, height: 347 },
  ]
  const frame = logoFrames[index]

  useLayoutEffect(() => { ScrollTrigger.refresh() }, [expanded])

  return (
    <article className={`timeline-item reveal${expanded ? ' is-expanded' : ''}`}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setExpanded(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) setExpanded(false)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(':hover')) setExpanded(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setExpanded(false)
      }}
    >
      <div className="timeline-item__number">0{index + 1}</div>
      <div className="timeline-item__period">{item.period}</div>
      <div className="timeline-item__main">
        <p>{item.organization}</p>
        <div className="timeline-item__heading">
          <svg className="timeline-item__logo" viewBox={frame.viewBox} role="img" aria-label={item.logoAlt || `${item.organization} logo`}>
            <defs>
              <filter id={filterId} colorInterpolationFilters="sRGB">
                {/* Key out the pale paper background without changing the brand RGB values. */}
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 0 3" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="1.18" intercept="-0.18" />
                </feComponentTransfer>
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
            </defs>
            <image href={item.logo} width={frame.width} height={frame.height} filter={`url(#${filterId})`} />
          </svg>
          <h3>{item.role}</h3>
        </div>
        <p className="timeline-item__summary">{item.summary}</p>
        <ul className="tag-list">
          {item.stack.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
        <div className="role-details">
          <button className="role-details__toggle" type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded(!expanded)}>
            <span>{expanded ? 'Close role details' : 'View role details'}</span>
            <span className="role-details__icon" aria-hidden="true">+</span>
          </button>
          <div id={panelId} className="role-details__panel" inert={!expanded} aria-hidden={!expanded} onTransitionEnd={(event) => {
            if (event.target === event.currentTarget) ScrollTrigger.refresh()
          }}>
          <div className="role-details__clip">
          <div className="role-details__content">
            <p className="role-details__eyebrow">Inside the role / 0{index + 1}</p>
            {item.details.map((detail) => <p key={detail}>{detail}</p>)}
            {item.image && (
              <figure>
                <img className="role-details__event-photo" src={item.image} alt={item.imageAlt} loading="lazy" width="2096" height="1170" onLoad={() => ScrollTrigger.refresh()} />
                <figcaption>On stage / MC at a Karunya University event</figcaption>
              </figure>
            )}
          </div>
          </div>
          </div>
        </div>
      </div>
      <div className="timeline-item__location">{item.location}</div>
    </article>
  )
}
