"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useReader, FONT_MIN, FONT_MAX } from "./reader-provider"
import { cn } from "@/lib/utils"

export function ReadingControls({ className }: { className?: string }) {
    const { prefs, setPrefs, increaseFont, decreaseFont } = useReader()

    return (
        <div
            className={cn("flex items-center gap-2 justify-between border rounded-md px-2 py-2 bg-card", className)}
            role="toolbar"
            aria-label="Reading preferences"
        >
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseFont}
                    aria-label="Decrease font size"
                    disabled={prefs.fontSize <= FONT_MIN}
                    title="Decrease font size"
                >
                    A-
                </Button>
                <div className="text-sm tabular-nums" aria-live="polite" aria-atomic="true">
                    {prefs.fontSize}px
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseFont}
                    aria-label="Increase font size"
                    disabled={prefs.fontSize >= FONT_MAX}
                    title="Increase font size"
                >
                    A+
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" aria-label="Change theme">
                            Theme
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Theme</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={prefs.theme}
                            onValueChange={(v) => setPrefs({ theme: v as typeof prefs.theme })}
                        >
                            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="sepia">Sepia</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" aria-label="Change font">
                            {prefs.font === "serif" ? "Serif" : "Sans"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Font</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={prefs.font}
                            onValueChange={(v) => setPrefs({ font: v as typeof prefs.font })}
                        >
                            <DropdownMenuRadioItem value="serif">Serif</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="sans">Sans</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="hidden md:block">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" aria-label="Change page width">
                                {prefs.width === "wide" ? "Wide" : "Normal"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Page width</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={prefs.width}
                                onValueChange={(v) => setPrefs({ width: v as typeof prefs.width })}
                            >
                                <DropdownMenuRadioItem value="normal">Normal</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="wide">Wide</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}
