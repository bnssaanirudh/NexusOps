import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none tracking-wide",
  {
    variants: {
      variant: {
        default:     "border-[#DDD5C8] bg-[#E8E2D9] text-[#6B6158]",
        secondary:   "border-[#D0DFF0] bg-[#D0DFF0] text-[#3A5070]",
        destructive: "border-[#F0C4BC] bg-[#F0C4BC] text-[#B84432]",
        outline:     "border-[#DDD5C8] text-[#6B6158] bg-transparent",
        healthy:     "border-[#C0D9C8] bg-[#C0D9C8] text-[#3A6B4A]",
        warning:     "border-[#F0DCA0] bg-[#F0DCA0] text-[#917320]",
        critical:    "border-[#F0C4BC] bg-[#F0C4BC] text-[#B84432]",
        info:        "border-[#D0DFF0] bg-[#D0DFF0] text-[#3A5070]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
