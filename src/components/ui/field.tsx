'use client';

import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: React.ReactNode
    helperText?: React.ReactNode
    errorText?: React.ReactNode
    optionalText?: React.ReactNode
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
    ({ className, label, children, helperText, errorText, optionalText, ...props }, ref) => {
        const id = React.useId()
        return (
            <div ref={ref} className={cn("grid gap-2", className)} {...props}>
                <div className="flex items-center justify-between">
                    {label && <Label htmlFor={id}>{label}</Label>}
                    {optionalText && <span className="text-sm text-gray-400">{optionalText}</span>}
                </div>
                {React.isValidElement(children) ? React.cloneElement(children, { id } as React.HTMLAttributes<HTMLElement>) : children}
                {helperText && <p className="text-sm text-gray-400">{helperText}</p>}
                {errorText && <p className="text-sm text-red-600">{errorText}</p>}
            </div>
        )
    }
)
Field.displayName = "Field"

export { Field }
