export function AsciiPanel({ lines, label }) {
  return (
    <figure className="ascii-panel" aria-label={label}>
      <div className="ascii-panel__top" aria-hidden="true">
        <span>SYS.VISUAL</span>
        <span>READY ●</span>
      </div>
      <pre aria-hidden="true">{lines.join('\n')}</pre>
    </figure>
  )
}
