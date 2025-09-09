import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default",
  children,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] shadow-lg": variant === "default",
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:scale-[1.02]": variant === "outline",
          "text-primary hover:bg-primary/10 hover:scale-[1.02]": variant === "ghost",
          "bg-error text-white hover:bg-error/90 hover:scale-[1.02]": variant === "destructive",
        },
        {
          "h-10 px-4 py-2": size === "default",
          "h-9 px-3": size === "sm",
          "h-11 px-8": size === "lg",
          "h-10 w-10": size === "icon",
        },
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