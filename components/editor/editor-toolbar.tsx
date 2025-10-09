"use client"

import type { Editor } from "@tiptap/react"
import {
    Bold,
    Italic,
    Underline,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    LinkIcon,
    ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    TableIcon,
    Code,
    Highlighter,
    Smile,
    RotateCcw,
    RotateCw,
    Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EditorToolbarProps {
    editor: Editor | null
    onImageUpload: () => void
    onLinkAdd: () => void
    onTableAdd: () => void
    onCodeBlockAdd: () => void
    onHighlightAdd: () => void
    onEmojiAdd: (emoji: string) => void
}

export function EditorToolbar({
    editor,
    onImageUpload,
    onLinkAdd,
    onTableAdd,
    onCodeBlockAdd,
    onHighlightAdd,
    onEmojiAdd,
}: EditorToolbarProps) {
    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-wrap gap-1 mb-4 p-2 bg-gray-50 rounded-md overflow-x-auto">
            {/* Text formatting */}
            <Button
                type="button"
                variant={editor.isActive("bold") ? "default" : "outline"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("italic") ? "default" : "outline"}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("underline") ? "default" : "outline"}
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline"
            >
                <Underline className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Headings */}
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Lists */}
            <Button
                type="button"
                variant={editor.isActive("bulletList") ? "default" : "outline"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("orderedList") ? "default" : "outline"}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Numbered List"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Insert elements */}
            <Button
                type="button"
                variant={editor.isActive("link") ? "default" : "outline"}
                size="sm"
                onClick={onLinkAdd}
                title="Add Link"
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onImageUpload} title="Upload Image">
                <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("table") ? "default" : "outline"}
                size="sm"
                onClick={onTableAdd}
                title="Insert Table"
            >
                <TableIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("codeBlock") ? "default" : "outline"}
                size="sm"
                onClick={onCodeBlockAdd}
                title="Code Block"
            >
                <Code className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive("highlight") ? "default" : "outline"}
                size="sm"
                onClick={onHighlightAdd}
                title="Highlight Text"
            >
                <Highlighter className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Text color */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="sm" title="Text Color">
                        <Palette className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                    <div className="grid grid-cols-4 gap-1">
                        {["#000000", "#958DF1", "#F98181", "#FBBC88", "#FAF594", "#70CFF8", "#94FADB", "#B9F18D"].map((color) => (
                            <Button
                                key={color}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-12 h-8 p-0"
                                style={{ backgroundColor: color }}
                                onClick={() => editor.chain().focus().setColor(color).run()}
                            />
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Text alignment */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="sm" title="Text Alignment">
                        <AlignLeft className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2">
                    <div className="flex flex-col gap-1">
                        <Button
                            type="button"
                            variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"}
                            size="sm"
                            onClick={() => editor.chain().focus().setTextAlign("left").run()}
                            className="justify-start"
                        >
                            <AlignLeft className="h-4 w-4 mr-2" /> Left
                        </Button>
                        <Button
                            type="button"
                            variant={editor.isActive({ textAlign: "center" }) ? "default" : "outline"}
                            size="sm"
                            onClick={() => editor.chain().focus().setTextAlign("center").run()}
                            className="justify-start"
                        >
                            <AlignCenter className="h-4 w-4 mr-2" /> Center
                        </Button>
                        <Button
                            type="button"
                            variant={editor.isActive({ textAlign: "right" }) ? "default" : "outline"}
                            size="sm"
                            onClick={() => editor.chain().focus().setTextAlign("right").run()}
                            className="justify-start"
                        >
                            <AlignRight className="h-4 w-4 mr-2" /> Right
                        </Button>
                        <Button
                            type="button"
                            variant={editor.isActive({ textAlign: "justify" }) ? "default" : "outline"}
                            size="sm"
                            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                            className="justify-start"
                        >
                            <AlignJustify className="h-4 w-4 mr-2" /> Justify
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Emoji picker */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="sm" title="Emoji">
                        <Smile className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                    <div className="grid grid-cols-8 gap-1">
                        {["😀", "😂", "😍", "🤔", "😎", "👍", "❤️", "🎉", "🔥", "⭐", "🚀", "💯", "🤖", "👏", "🌈", "🍕"].map(
                            (emoji) => (
                                <Button
                                    key={emoji}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => onEmojiAdd(emoji)}
                                >
                                    {emoji}
                                </Button>
                            ),
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* History controls */}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
            >
                <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
            >
                <RotateCw className="h-4 w-4" />
            </Button>
        </div>
    )
}
