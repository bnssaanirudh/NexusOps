import { MachineStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: MachineStatus;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
}

const statusConfig: Record<MachineStatus, { bg: string; text: string; dot: string; label: string }> = {
  Healthy: {
    bg: "bg-emerald-500/15 border border-emerald-500/30",
    text: "text-emerald-400",
    dot: "bg-emerald-400 shadow-[0_0_6px_#34d399]",
    label: "Healthy",
  },
  Warning: {
    bg: "bg-amber-500/15 border border-amber-500/30",
    text: "text-amber-400",
    dot: "bg-amber-400 shadow-[0_0_6px_#fbbf24]",
    label: "Warning",
  },
  Risk: {
    bg: "bg-orange-500/15 border border-orange-500/30",
    text: "text-orange-400",
    dot: "bg-orange-400 shadow-[0_0_6px_#fb923c]",
    label: "Risk",
  },
  Critical: {
    bg: "bg-red-500/15 border border-red-500/30",
    text: "text-red-400",
    dot: "bg-red-400 shadow-[0_0_6px_#f87171] animate-pulse",
    label: "Critical",
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-3 py-1 text-sm gap-1.5",
  lg: "px-4 py-1.5 text-base gap-2",
};

const dotSizes = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
};

export function StatusBadge({ status, size = "md", showDot = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${config.bg} ${config.text} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span className={`rounded-full ${config.dot} ${dotSizes[size]} shrink-0`} />
      )}
      {config.label}
    </span>
  );
}
