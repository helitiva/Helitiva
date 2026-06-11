export type LabStatus = 'EXPLORING' | 'INCUBATING' | 'SHIPPED'

const STYLE: Record<LabStatus, string> = {
  EXPLORING: 'text-sky-300 border-sky-400/25 bg-sky-400/[0.06]',
  INCUBATING: 'text-amber-300 border-amber-400/25 bg-amber-400/[0.06]',
  SHIPPED: 'text-emerald-300 border-emerald-400/25 bg-emerald-400/[0.06]',
}

export function StatusPill({ status }: { status: LabStatus }) {
  return (
    <span className={`font-mono text-[10.5px] tracking-[0.14em] border rounded-full px-3 py-1 ${STYLE[status]}`}>
      {status}
    </span>
  )
}
