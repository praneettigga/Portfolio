export function SectionHeading({ number, eyebrow, title, count }) {
  return (
    <div className="section-heading reveal">
      <div className="section-heading__meta">
        <span>{number}</span>
        <span>{eyebrow}</span>
        {count && <span>{count}</span>}
      </div>
      <h2>{title}</h2>
    </div>
  )
}
