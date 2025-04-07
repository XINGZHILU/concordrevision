'use client';

import Pomodoro from "@/lib/customui/Basic/pomodoro";
import {
    ActionBarCloseTrigger,
    ActionBarContent,
    ActionBarRoot,
    ActionBarSeparator,
} from "@/components/ui/action-bar"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

export default function PomodoroActionBar() {
    const [checked, setChecked] = useState(false)
    return (<></>);
    return (
        <>
            <Checkbox
                checked={checked}
                onCheckedChange={(e) => setChecked(!!e.checked)}
            >
                <p className="text-gray-500">Pomodoro Timer</p>
            </Checkbox>
            <ActionBarRoot
                open={checked}
                onOpenChange={(e) => setChecked(e.open)}
                closeOnInteractOutside={false}
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