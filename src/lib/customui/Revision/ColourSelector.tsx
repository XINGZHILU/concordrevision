'use client';

import { useState } from "react";
import { toaster } from "../../../components/ui/toaster";
import { LuCircleAlert, LuCircleCheck, LuCircleEllipsis, LuCircleHelp } from "react-icons/lu";
import { cva } from "class-variance-authority";
import { Colour } from "@prisma/client";
import { useRouter } from "next/navigation";

const colorButtonVariants = cva(
  "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors border",
  {
    variants: {
      color: {
        Unclassified: "bg-muted text-muted-foreground border-border hover:bg-accent",
        Green: "bg-success/20 text-success border-success/40",
        Amber: "bg-warning/20 text-warning border-warning/40",
        Red: "bg-destructive/20 text-destructive border-destructive/40",
      },
      selected: {
        true: "ring-2 ring-primary ring-offset-2",
        false: "",
      }
    }
  }
);

const colorOptions: { value: Colour; label: string; }[] = [
    { value: "Unclassified", label: "Unclassified" },
    { value: "Green", label: "Green" },
    { value: "Amber", label: "Amber" },
    { value: "Red", label: "Red" }
];

function GetSymbol({ colour }: { colour: Colour }) {
    switch (colour) {
        case "Green": return <LuCircleCheck />;
        case "Amber": return <LuCircleEllipsis />;
        case "Red": return <LuCircleAlert />;
        default: return <LuCircleHelp />;
    }
}

export default function ColourSelector({ noteId, subjectId, initialColour }: {
  noteId: number,
  subjectId: number,
  initialColour: Colour
}) {
  const [selectedColor, setSelectedColor] = useState(initialColour);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSetColour(colour: Colour) {
    if (colour === selectedColor || isLoading) return;

    const previousColor = selectedColor;
    setIsLoading(true);
    setSelectedColor(colour);

    try {
      const response = await fetch('/api/colour-links', {
        method: 'POST',
        body: JSON.stringify({ noteId, subjectId, colour }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error("Failed to update knowledge level");

      toaster.success({
        title: "Success",
        description: "Knowledge level updated",
      });
      router.refresh();
      
    } catch (error) {
      console.error(error);
      toaster.error({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      setSelectedColor(previousColor); // Revert on failure
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center flex-wrap gap-2">
      {colorOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={isLoading}
          className={colorButtonVariants({ color: option.value, selected: selectedColor === option.value })}
          onClick={() => handleSetColour(option.value)}
        >
          <GetSymbol colour={option.value} />
          <span className="ml-1.5">{option.label}</span>
        </button>
      ))}
    </div>
  );
}