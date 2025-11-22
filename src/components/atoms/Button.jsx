import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg",
    secondary: "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white",
    ghost: "text-gray-600 hover:text-primary hover:bg-gray-50",
    accent: "bg-accent hover:bg-accent/90 text-white shadow-md hover:shadow-lg",
    success: "bg-success hover:bg-success/90 text-white shadow-md hover:shadow-lg",
    error: "bg-error hover:bg-error/90 text-white shadow-md hover:shadow-lg"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed",
        "hover:transform hover:-translate-y-0.5",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button