import type { SessionStatus } from '@/types';

interface BadgeProps {
  status: SessionStatus;
}

const statusConfig: Record<SessionStatus, { label: string; className: string }> = {
  created: {
    label: 'Created',
    className: 'bg-slate-700 text-slate-300',
  },
  link_generated: {
    label: 'Link Generated',
    className: 'bg-blue-900/50 text-blue-400 border border-blue-800',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-amber-900/50 text-amber-400 border border-amber-800',
  },
  submitted: {
    label: 'Submitted',
    className: 'bg-emerald-900/50 text-emerald-400 border border-emerald-800',
  },
  incomplete: {
    label: 'Incomplete',
    className: 'bg-red-900/50 text-red-400 border border-red-800',
  },
};

export function Badge({ status }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full
        text-xs font-medium
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}
