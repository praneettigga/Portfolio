import { Fragment } from 'react'

export function SectionHeading({ number, eyebrow, title, count }) {
  const words = title.split(' ')
  return (
    <div className="section-heading reveal">
      <div className="section-heading__meta">
        <span>{number}</span>
        <span>{eyebrow}</span>
        {count && <span>{count}</span>}
      </div>
      <h2 aria-label={title}>
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="heading-word-mask" aria-hidden="true">
              <span className="heading-word">{word}</span>
            </span>{index < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </h2>
    </div>
  )
}
