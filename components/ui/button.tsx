import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-(--radius-control) border border-transparent bg-clip-padding text-(length:--text-control) leading-(--leading-control) font-normal whitespace-nowrap shadow-xs transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-(--control-icon)",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-sm active:not-aria-[haspopup]:bg-primary/80 active:not-aria-[haspopup]:shadow-xs",
        outline:
          "border-border/80 bg-background text-foreground shadow-xs hover:border-border hover:bg-muted/70 hover:text-foreground hover:shadow-sm active:not-aria-[haspopup]:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/20 dark:hover:bg-input/40",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_4%)] hover:shadow-sm active:not-aria-[haspopup]:shadow-xs aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "shadow-none hover:bg-muted/70 hover:text-foreground active:not-aria-[haspopup]:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/40",
        destructive:
          "bg-destructive/10 text-destructive shadow-xs hover:bg-destructive/20 hover:shadow-sm focus-visible:border-destructive/40 focus-visible:ring-destructive/25 active:not-aria-[haspopup]:bg-destructive/25 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 shadow-none hover:underline active:not-aria-[haspopup]:scale-100",
      },
      size: {
        default:
          "h-(--control-h-md) gap-(--space-inline) px-(--space-control-x) in-data-[slot=button-group]:rounded-(--radius-control) has-data-[icon=inline-end]:pe-[calc(var(--space-control-x)*0.85)] has-data-[icon=inline-start]:ps-[calc(var(--space-control-x)*0.85)]",
        xs: "h-(--control-h-xs) gap-1.5 rounded-(--radius-control) px-2.5 text-(length:--text-control-sm) in-data-[slot=button-group]:rounded-(--radius-control) has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-(--control-icon-sm)",
        sm: "h-(--control-h-sm) gap-(--space-inline) rounded-(--radius-control) px-(--space-control-x) text-(length:--text-control-sm) in-data-[slot=button-group]:rounded-(--radius-control) has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5 [&_svg:not([class*='size-'])]:size-(--control-icon-sm)",
        lg: "h-(--control-h-lg) gap-2.5 px-[calc(var(--space-control-x)*1.15)] has-data-[icon=inline-end]:pe-3.5 has-data-[icon=inline-start]:ps-3.5",
        icon: "size-(--control-h-md)",
        "icon-xs":
          "size-(--control-h-xs) rounded-(--radius-control) in-data-[slot=button-group]:rounded-(--radius-control) [&_svg:not([class*='size-'])]:size-(--control-icon-sm)",
        "icon-sm":
          "size-(--control-h-sm) rounded-(--radius-control) in-data-[slot=button-group]:rounded-(--radius-control) [&_svg:not([class*='size-'])]:size-(--control-icon-sm)",
        "icon-lg": "size-(--control-h-lg)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
