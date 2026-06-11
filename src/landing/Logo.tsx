export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="#34d399" aria-hidden="true">
      <path d="M35.6 89.5 A42 42 0 0 1 35.6 10.5 L40.8 24.6 A27 27 0 0 0 40.8 75.4Z" />
      <path d="M64.4 10.5 A42 42 0 0 1 64.4 89.5 L59.2 75.4 A27 27 0 0 0 59.2 24.6Z" />
      <rect x="8" y="43" width="84" height="14" />
    </svg>
  )
}

export function Wordmark({ size = 28, textClass = 'text-[19px]' }: { size?: number; textClass?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo size={size} />
      <span className={`font-display font-bold tracking-tight ${textClass}`}>
        Helitiva<span className="text-emerald-400">_</span>
      </span>
    </span>
  )
}
