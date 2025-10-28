'use client';

import React, { useEffect, useRef } from "react";
import { CloseButton } from "@/components/ui/close-button";

interface ActionBarRootProps {
    open: boolean;
    onOpenChange: (props: { open: boolean }) => void;
    children: React.ReactNode;
    closeOnInteractOutside?: boolean;
}

export const ActionBarRoot: React.FC<ActionBarRootProps> = ({ open, onOpenChange, children, closeOnInteractOutside = true }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open || !closeOnInteractOutside) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onOpenChange({ open: false });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onOpenChange, closeOnInteractOutside]);


    if (!open) return null;

    return (
        <ActionBarContext.Provider value={{ onOpenChange }}>
            <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center" ref={ref}>
                {children}
            </div>
        </ActionBarContext.Provider>
    );
};

interface ActionBarContentProps {
    children: React.ReactNode;
}

export const ActionBarContent: React.FC<ActionBarContentProps> = ({ children }) => {
    return (
        <div className="bg-background shadow-2xl rounded-lg border border-border flex items-center space-x-4 p-2">
                    {children}
        </div>
    );
};

export const ActionBarCloseTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(function ActionBarCloseTrigger(props, ref) {
    const { onClick, ...rest } = props;
    const { onOpenChange } = React.useContext(ActionBarContext);
    return (
        <CloseButton ref={ref} {...rest} onClick={(e) => {
            onClick?.(e);
            onOpenChange({ open: false });
        }} size="sm" />
    )
})

const ActionBarContext = React.createContext<{
    onOpenChange: (props: { open: boolean }) => void;
}>({
    onOpenChange: () => {},
});

export const ActionBarSeparator = () => (
    <div className="h-6 w-px bg-border" />
);

export const ActionBarSelectionTrigger = () => null;
