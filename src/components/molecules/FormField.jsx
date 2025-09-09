import React from "react"
import { cn } from "@/utils/cn"
import Label from "@/components/atoms/Label"

const FormField = ({ 
  label, 
  error,
  required,
  className,
  children,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export default FormField