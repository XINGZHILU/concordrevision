'use client';

import Pomodoro from "@/lib/customui/Basic/pomodoro";
import {
    ActionBarCloseTrigger,
    ActionBarContent,
    ActionBarRoot,
    ActionBarSeparator,
} from '@/lib/components/ui/action-bar'
import { Checkbox } from '@/lib/components/ui/checkbox'
import { useState } from "react"

export default function PomodoroActionBar() {
    const [checked, setChecked] = useState(false)
    return (
        <>
            <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                label="Pomodoro Timer"
            />
            <ActionBarRoot
                open={checked}
                onOpenChange={(e) => setChecked(e.open)}
            >
                <ActionBarContent>
                    <Pomodoro />
                    <ActionBarSeparator />
                    <ActionBarCloseTrigger />
                </ActionBarContent>
            </ActionBarRoot>
        </>
    )
}