'use client';

import React from "react";
import { Check } from "lucide-react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
                <input
                    type="checkbox"
                    ref={ref}
                    className="peer h-4 w-4 shrink-0 rounded-sm border border-concord-primary ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-concord-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-concord-primary checked:text-white"
                    {...props}
                />
                {label && <span className="text-sm font-medium text-concord-text">{label}</span>}
                <div className="absolute w-4 h-4 hidden peer-checked:block pointer-events-none">
                    <Check className="h-4 w-4 text-white" />
                </div>
            </label>
        );
    }
);

Checkbox.displayName = "Checkbox";
