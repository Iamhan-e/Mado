import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 text-base"
    
    const variants = {
      primary: "bg-primary hover:bg-primary-dark text-white focus:ring-primary",
      secondary: "bg-secondary hover:bg-secondary-dark text-white focus:ring-secondary",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
      ghost: "text-primary hover:bg-primary/10 focus:ring-primary",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
export { Button }