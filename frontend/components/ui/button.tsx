import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C07C2A] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:     "bg-[#1C1A18] text-[#F2EEE8] hover:bg-[#3D3830] shadow-sm hover:shadow-md hover:-translate-y-px",
        destructive: "bg-[#B84432] text-white hover:bg-[#9e3929] shadow-sm",
        outline:     "border border-[#DDD5C8] bg-[#F2EEE8] text-[#1C1A18] hover:bg-[#E8E2D9] hover:border-[#C8BEB2]",
        secondary:   "bg-[#E8E2D9] text-[#1C1A18] hover:bg-[#DDD5C8]",
        ghost:       "hover:bg-[#E8E2D9] text-[#3D3830] hover:text-[#1C1A18]",
        amber:       "bg-[#C07C2A] text-white hover:bg-[#E8943A] shadow-sm hover:-translate-y-px",
        link:        "text-[#C07C2A] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-8 rounded-md px-3 text-xs",
        lg:      "h-11 rounded-lg px-6",
        icon:    "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
