import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { badgeVariants } from "./lib/badgeVariants"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component for displaying small labels or status indicators.
 *
 * @param props - Badge properties.
 * @param props.className - Additional CSS classes.
 * @param props.variant - Badge style variant.
 * @returns Badge element.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
