/** The N-mark: three bars, the third in signal red. From /public/favicon.svg. */
export function Mark({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
      style={{ display: 'block' }}
    >
      <rect x="22" y="20" width="10" height="60" fill="currentColor" />
      <polygon points="32,20 42,20 55,80 45,80" fill="currentColor" />
      <polygon points="66,20 76,20 65,80 55,80" fill="rgb(var(--c-red))" />
    </svg>
  );
}
