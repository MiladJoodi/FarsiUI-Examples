import { cn } from "cn"
import { Loader2Icon } from "lucide-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label="در حال بارگذاری" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
