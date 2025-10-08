"use client"

import { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    LinkIcon,
    Quote,
    Code,
    List,
    ListOrdered,
    Minus,
    Eye,
    SplitSquareVertical,
    Type,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

type MarkdownEditorProps = {
    value: string
    onChange: (next: string) => void
    label?: string
    placeholder?: string
    className?: string
}

export function MarkdownEditor({
    value,
    onChange,
    label = "Content",
    placeholder = "Write your chapter content in Markdown...",
    className,
}: MarkdownEditorProps) {
    const [mode, setMode] = useState<"edit" | "preview" | "split">("split")
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    function applyFormatting(prefix: string, suffix = "") {
        const ta = textareaRef.current
        if (!ta) return
        const start = ta.selectionStart ?? value.length
        const end = ta.selectionEnd ?? value.length
        const selected = value.slice(start, end)
        const next = value.slice(0, start) + prefix + selected + suffix + value.slice(end)
        onChange(next)
        // move cursor after prefix if no selection
        requestAnimationFrame(() => {
            if (!ta) return
            const pos = selected ? end + prefix.length + suffix.length : start + prefix.length
            ta.focus()
            ta.setSelectionRange(pos, pos)
        })
    }

    function applyLinePrefix(linePrefix: string) {
        const ta = textareaRef.current
        if (!ta) return
        const start = ta.selectionStart ?? 0
        const end = ta.selectionEnd ?? 0

        // Expand to full lines
        const before = value.slice(0, start)
        const sel = value.slice(start, end)
        const after = value.slice(end)

        const lineStart = before.lastIndexOf("\n") + 1
        const lineEnd = end + sel.indexOf("\n") + (sel.includes("\n") ? sel.lastIndexOf("\n") : 0)

        const selection = value.slice(lineStart, end)
        const lines = selection.split("\n")
        const updated = lines.map((l) => (l.startsWith(linePrefix) ? l : `${linePrefix}${l}`)).join("\n")

        const next = value.slice(0, lineStart) + updated + after
        onChange(next)
        requestAnimationFrame(() => {
            ta.focus()
        })
    }

    const preview = useMemo(() => {
        return (
            <div className="prose prose-neutral max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || "Nothing to preview yet."}</ReactMarkdown>
            </div>
        )
    }, [value])

    const editor = (
        <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-1">
                <Button variant="outline" size="icon" aria-label="Bold" onClick={() => applyFormatting("**", "**")}>
                    <Bold className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Italic" onClick={() => applyFormatting("_", "_")}>
                    <Italic className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="H1" onClick={() => applyLinePrefix("# ")}>
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="H2" onClick={() => applyLinePrefix("## ")}>
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="H3" onClick={() => applyLinePrefix("### ")}>
                    <Heading3 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Link" onClick={() => applyFormatting("[", "](https://)")}>
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Quote" onClick={() => applyLinePrefix("> ")}>
                    <Quote className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Code" onClick={() => applyFormatting("`", "`")}>
                    <Code className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Bulleted list" onClick={() => applyLinePrefix("- ")}>
                    <List className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Numbered list" onClick={() => applyLinePrefix("1. ")}>
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="Horizontal rule"
                    onClick={() => applyFormatting("\n\n---\n\n")}
                >
                    <Minus className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="mx-2 h-6" />

                <div className="flex items-center gap-1">
                    <Button
                        variant={mode === "edit" ? "default" : "outline"}
                        size="sm"
                        aria-pressed={mode === "edit"}
                        onClick={() => setMode("edit")}
                        className="gap-1"
                    >
                        <Type className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                        variant={mode === "preview" ? "default" : "outline"}
                        size="sm"
                        aria-pressed={mode === "preview"}
                        onClick={() => setMode("preview")}
                        className="gap-1"
                    >
                        <Eye className="h-4 w-4" /> Preview
                    </Button>
                    <Button
                        variant={mode === "split" ? "default" : "outline"}
                        size="sm"
                        aria-pressed={mode === "split"}
                        onClick={() => setMode("split")}
                        className="gap-1"
                    >
                        <SplitSquareVertical className="h-4 w-4" /> Split
                    </Button>
                </div>
            </div>

            <div className={cn("mt-2 grid gap-4", mode === "split" ? "md:grid-cols-2" : "grid-cols-1")} aria-live="polite">
                {(mode === "edit" || mode === "split") && (
                    <div>
                        <label htmlFor="md-content" className="sr-only">
                            {label}
                        </label>
                        <Textarea
                            id="md-content"
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className="min-h-[360px]"
                        />
                    </div>
                )}
                {(mode === "preview" || mode === "split") && <div className="min-h-[360px] overflow-auto">{preview}</div>}
            </div>
        </div>
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent>{editor}</CardContent>
        </Card>
    )
}
