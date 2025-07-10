'use client';

import React from "react";
import { X } from "lucide-react";
import { cva, VariantProps } from "class-variance-authority";

const closeButtonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-concord-primary",
    {
        variants: {
            size: {
                sm: "p-1",
                md: "p-2",
                lg: "p-3",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

export interface CloseButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof closeButtonVariants> {}

export const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
    ({ className, size, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={closeButtonVariants({ size, className })}
                aria-label="Close"
                {...props}
            >
                <X className={size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6"} />
            </button>
        );
    }
);

CloseButton.displayName = "CloseButton";
