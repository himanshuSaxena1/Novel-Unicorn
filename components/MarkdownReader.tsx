"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { useReadingSettings } from "@/hooks/use-reading-settings"

type MarkdownReaderProps = {
    title?: string
    content: string
}

export function MarkdownReader({ title, content }: MarkdownReaderProps) {
    const [settings, setSettings] = useReadingSettings()

    const themeClasses = useMemo(() => {
        switch (settings.theme) {
            case "light":
                return "bg-background text-foreground"
            case "dark":
                return "dark bg-background text-foreground"
            case "sepia":
                // Use semantic tokens: accent background with accent-foreground for a warm scheme
                return "bg-accent text-accent-foreground"
            case "system":
            default:
                return "bg-background text-foreground"
        }
    }, [settings.theme])

    const containerWidth = settings.maxWidth === "narrow" ? "max-w-3xl" : "max-w-5xl"
    const fontFamily = settings.font === "serif" ? "font-serif" : "font-sans"
    const lineHeight = (settings.lineHeight / 100).toFixed(2)

    return (
        <div className={cn("w-full", themeClasses)}>
            <div className={cn("mx-auto px-4 py-6 md:py-10", containerWidth)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-balance">{title || "Chapter"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">``
                                <Label>Theme</Label>
                                <Select value={settings.theme} onValueChange={(v) => setSettings({ ...settings, theme: v as any })}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="system">System</SelectItem>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="sepia">Sepia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label>Font</Label>
                                <Select value={settings.font} onValueChange={(v) => setSettings({ ...settings, font: v as any })}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="serif">Serif</SelectItem>
                                        <SelectItem value="sans">Sans</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label>Width</Label>
                                <Select
                                    value={settings.maxWidth}
                                    onValueChange={(v) => setSettings({ ...settings, maxWidth: v as any })}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="narrow">Narrow</SelectItem>
                                        <SelectItem value="wide">Wide</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label>Text Size</Label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSettings({ ...settings, fontSize: Math.max(14, settings.fontSize - 1) })}
                                        aria-label="Decrease text size"
                                    >
                                        A-
                                    </Button>
                                    <span className="tabular-nums">{settings.fontSize}px</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSettings({ ...settings, fontSize: Math.min(28, settings.fontSize + 1) })}
                                        aria-label="Increase text size"
                                    >
                                        A+
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label>Line Height</Label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSettings({ ...settings, lineHeight: Math.max(120, settings.lineHeight - 10) })}
                                        aria-label="Decrease line height"
                                    >
                                        -
                                    </Button>
                                    <span className="tabular-nums">{settings.lineHeight}%</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSettings({ ...settings, lineHeight: Math.min(220, settings.lineHeight + 10) })}
                                        aria-label="Increase line height"
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <article
                            className={cn("reading-content", fontFamily, "text-pretty")}
                            style={{
                                fontSize: `${settings.fontSize}px`,
                                lineHeight: lineHeight as any,
                            }}
                        >
                            <div className="prose prose-neutral max-w-none dark:prose-invert">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                            </div>
                        </article>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
