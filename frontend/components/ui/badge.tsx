import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#0F4C81] text-white hover:bg-[#0F4C81]/80",
        secondary:
          "border-transparent bg-[#1F6FEB] text-white hover:bg-[#1F6FEB]/80",
        destructive:
          "border-transparent bg-[#DC2626] text-white hover:bg-[#DC2626]/80",
        outline: "text-slate-950",
        healthy: "border-transparent bg-[#16A34A] text-white hover:bg-[#16A34A]/80",
        warning: "border-transparent bg-[#F59E0B] text-white hover:bg-[#F59E0B]/80",
        critical: "border-transparent bg-[#DC2626] text-white hover:bg-[#DC2626]/80",
        info: "border-transparent bg-[#2563EB] text-white hover:bg-[#2563EB]/80",
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
