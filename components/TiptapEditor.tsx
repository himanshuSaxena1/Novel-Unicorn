"use client"

import type React from "react"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { createLowlight, common } from "lowlight"
import Placeholder from "@tiptap/extension-placeholder"
import Highlight from "@tiptap/extension-highlight"
import { useEffect, useRef, useState } from "react"
import { uploadImage } from "@/lib/upload-image"
import { EditorToolbar } from "./editor/editor-toolbar"
import { ImageToolbar } from "./editor/image-toolbar"

// Custom image extension with resizing and dragging
const DraggableResizableImage = Image.extend({
    name: "draggableImage",

    addAttributes() {
        return {
            ...this.parent?.(),
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            width: {
                default: "auto",
                renderHTML: (attributes: any) => ({
                    width: attributes.width,
                }),
            },
            height: {
                default: "auto",
                renderHTML: (attributes: any) => ({
                    height: attributes.height,
                }),
            },
            draggable: {
                default: "true",
                renderHTML: (attributes: any) => ({
                    draggable: attributes.draggable,
                }),
            },
            "data-position": {
                default: "inline",
                renderHTML: (attributes: any) => ({
                    "data-position": attributes["data-position"],
                }),
            },
            "data-align": {
                default: "left",
                renderHTML: (attributes: any) => ({
                    "data-align": attributes["data-align"],
                }),
            },
            style: {
                default: null,
                renderHTML: (attributes: any) => ({
                    style: attributes.style,
                }),
            },
        }
    },
})

interface EditorProps {
    value: string
    onChange: (val: string) => void
    placeholder?: string
}

export default function CursorResizableEditor({ value, onChange, placeholder = "Write something..." }: EditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadProgress, setUploadProgress] = useState<number | null>(null)
    const [activeImage, setActiveImage] = useState<HTMLElement | null>(null)
    const [isResizing, setIsResizing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 })
    const dragStartRef = useRef({ x: 0, y: 0, left: 0, top: 0 })
    const imageRef = useRef<HTMLElement | null>(null)
    const editorContainerRef = useRef<HTMLDivElement>(null)

    const lowlight = createLowlight(common)
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Underline,
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
            }),
            DraggableResizableImage,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableCell,
            TableHeader,
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Placeholder.configure({
                placeholder,
            }),
            Highlight,
        ],
        immediatelyRender: false,
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    // Handle image interactions
    useEffect(() => {
        if (!editor) return

        const handleImageClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement

            // If we clicked on an image
            if (target.tagName === "IMG") {
                // Prevent default behavior to avoid text selection
                event.preventDefault()

                // Set the active image
                setActiveImage(target)
                imageRef.current = target

                // Add resize handles
                addResizeHandles(target)
            }
            // If we clicked outside an image
            else if (
                activeImage &&
                !event.composedPath().includes(activeImage) &&
                !target.classList.contains("resize-handle")
            ) {
                setActiveImage(null)
                removeResizeHandles()
            }
        }

        // Add resize handles to an image
        const addResizeHandles = (img: HTMLElement) => {
            const parent = img.parentElement
            if (!parent) return

            // Remove any existing handles first
            removeResizeHandles()

            // Make parent position relative if it's not already
            if (window.getComputedStyle(parent).position === "static") {
                parent.style.position = "relative"
            }

            // Create container for handles
            const handleContainer = document.createElement("div")
            handleContainer.className = "resize-handles-container"
            handleContainer.style.position = "absolute"
            handleContainer.style.top = "0"
            handleContainer.style.left = "0"
            handleContainer.style.width = "100%"
            handleContainer.style.height = "100%"
            handleContainer.style.pointerEvents = "none"
            parent.appendChild(handleContainer)

            // Add the corner handles
            const corners = ["nw", "ne", "se", "sw"]
            corners.forEach((corner) => {
                const handle = document.createElement("div")
                handle.className = `resize-handle resize-handle-${corner}`
                handle.setAttribute("data-handle", corner)
                handle.style.position = "absolute"
                handle.style.width = "12px"
                handle.style.height = "12px"
                handle.style.backgroundColor = "white"
                handle.style.border = "2px solid #4299e1"
                handle.style.borderRadius = "50%"
                handle.style.pointerEvents = "all"

                // Position the handle
                switch (corner) {
                    case "nw":
                        handle.style.top = "-6px"
                        handle.style.left = "-6px"
                        handle.style.cursor = "nw-resize"
                        break
                    case "ne":
                        handle.style.top = "-6px"
                        handle.style.right = "-6px"
                        handle.style.cursor = "ne-resize"
                        break
                    case "se":
                        handle.style.bottom = "-6px"
                        handle.style.right = "-6px"
                        handle.style.cursor = "se-resize"
                        break
                    case "sw":
                        handle.style.bottom = "-6px"
                        handle.style.left = "-6px"
                        handle.style.cursor = "sw-resize"
                        break
                }

                handleContainer.appendChild(handle)
            })
        }

        // Remove all resize handles
        const removeResizeHandles = () => {
            document.querySelectorAll(".resize-handles-container").forEach((container) => {
                container.remove()
            })
        }

        // Handle mouse down on image or resize handles
        const handleMouseDown = (event: MouseEvent) => {
            const target = event.target as HTMLElement

            // If we're clicking on a resize handle
            if (target.classList.contains("resize-handle") && activeImage) {
                event.preventDefault()
                event.stopPropagation()
                setIsResizing(true)

                // Store which handle we're using
                const handle = target.getAttribute("data-handle")

                // Store initial mouse position and image size
                resizeStartRef.current = {
                    x: event.clientX,
                    y: event.clientY,
                    width: activeImage.clientWidth,
                    height: activeImage.clientHeight,
                }
            }
            // If we're clicking on the image itself (for dragging)
            else if (target.tagName === "IMG" && !isResizing) {
                // Only start dragging if the image is already selected
                if (activeImage === target) {
                    event.preventDefault()
                    setIsDragging(true)

                    // Get the current position
                    const rect = target.getBoundingClientRect()
                    const style = window.getComputedStyle(target)

                    // Store initial mouse and image position
                    dragStartRef.current = {
                        x: event.clientX,
                        y: event.clientY,
                        left: Number.parseInt(style.marginLeft || "0"),
                        top: Number.parseInt(style.marginTop || "0"),
                    }
                }
            }
        }

        // Handle mouse move for resizing or dragging
        const handleMouseMove = (event: MouseEvent) => {
            // Handle resizing
            if (isResizing && activeImage) {
                event.preventDefault()

                const dx = event.clientX - resizeStartRef.current.x
                const dy = event.clientY - resizeStartRef.current.y

                // Calculate new dimensions while maintaining aspect ratio
                const aspectRatio = resizeStartRef.current.width / resizeStartRef.current.height
                const newWidth = resizeStartRef.current.width + dx
                const newHeight = newWidth / aspectRatio

                // Apply minimum size constraints
                if (newWidth >= 50 && newHeight >= 50) {
                    // Update the image size
                    activeImage.style.width = `${newWidth}px`
                    activeImage.style.height = `${newHeight}px`

                    // Update the image attributes in the editor
                    editor.commands.updateAttributes("draggableImage", {
                        width: `${newWidth}px`,
                        height: `${newHeight}px`,
                    })
                }
            }

            // Handle dragging
            else if (isDragging && activeImage) {
                event.preventDefault()

                const dx = event.clientX - dragStartRef.current.x
                const dy = event.clientY - dragStartRef.current.y

                // Calculate new position
                const newLeft = dragStartRef.current.left + dx
                const newTop = dragStartRef.current.top + dy

                // Apply new position
                activeImage.style.marginLeft = `${newLeft}px`
                activeImage.style.marginTop = `${newTop}px`

                // Determine alignment based on position
                let align = "left"
                const editorWidth = editorContainerRef.current?.clientWidth || 0
                const imageCenter = newLeft + activeImage.clientWidth / 2

                if (imageCenter > editorWidth * 0.66) {
                    align = "right"
                } else if (imageCenter > editorWidth * 0.33) {
                    align = "center"
                }

                // Update the image attributes in the editor
                editor.commands.updateAttributes("draggableImage", {
                    style: `margin-left: ${newLeft}px; margin-top: ${newTop}px;`,
                    "data-position": "floating",
                    "data-align": align,
                })
            }
        }

        // Handle mouse up to end resizing or dragging
        const handleMouseUp = () => {
            if (isResizing) {
                setIsResizing(false)
            }
            if (isDragging) {
                setIsDragging(false)
            }
        }

        // Add event listeners
        document.addEventListener("click", handleImageClick)
        document.addEventListener("mousedown", handleMouseDown)
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)

        return () => {
            document.removeEventListener("click", handleImageClick)
            document.removeEventListener("mousedown", handleMouseDown)
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [editor, activeImage, isResizing, isDragging])

    const handleImageUpload = async (file: File) => {
        if (!file || !editor) return

        const uploadId = `upload-${Date.now()}`

        try {
            // Create a local preview URL
            const previewUrl = URL.createObjectURL(file)

            // Insert the image with the preview URL
            editor.commands.insertContent(`
        <img 
          src="${previewUrl}" 
          alt="${file.name}" 
          title="Uploading..." 
          data-upload-id="${uploadId}"
          style="max-width: 100%; height: auto;"
        />
      `)

            // Upload with progress tracking
            const imageUrl = await uploadImage(file, (progress) => {
                setUploadProgress(progress)
            })

            // Find the image with this upload ID and update its src
            const images = editor.view.dom.querySelectorAll(`img[data-upload-id="${uploadId}"]`)
            if (images.length > 0) {
                editor.commands.command(({ tr }) => {
                    const pos = editor.view.posAtDOM(images[0], 0)
                    tr.setNodeMarkup(pos, undefined, {
                        src: imageUrl,
                        alt: file.name,
                        title: file.name,
                        "data-upload-id": null,
                    })
                    return true
                })
            }
        } catch (error) {
            // Remove the image if upload failed
            const images = editor.view.dom.querySelectorAll(`img[data-upload-id="${uploadId}"]`)
            if (images.length > 0) {
                const pos = editor.view.posAtDOM(images[0], 0)
                editor.commands.deleteRange({ from: pos, to: pos + 1 })
            }
            alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
        } finally {
            setUploadProgress(null)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.match("image.*")) {
            alert("Please select an image file (JPEG, PNG, etc.)")
            return
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be smaller than 5MB")
            return
        }

        handleImageUpload(file)
        e.target.value = ""
    }

    const setLink = () => {
        const previousUrl = editor?.getAttributes("link").href
        const url = window.prompt("URL", previousUrl)

        if (url === null) return
        if (url === "") {
            editor?.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }
        editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    const addTable = () => {
        editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }

    const addCodeBlock = () => {
        editor?.chain().focus().toggleCodeBlock().run()
    }

    const addHighlight = () => {
        editor?.chain().focus().toggleHighlight().run()
    }

    const addEmoji = (emoji: string) => {
        editor?.chain().focus().insertContent(emoji).run()
    }

    const alignImage = (align: "left" | "center" | "right") => {
        if (!editor || !activeImage) return

        let style = ""

        if (align === "center") {
            style = "display: block; margin-left: auto; margin-right: auto;"
        } else if (align === "right") {
            style = "float: right; margin-left: 1rem; margin-right: 0;"
        } else {
            style = "float: left; margin-right: 1rem; margin-left: 0;"
        }

        // Preserve the current width and height
        const width = activeImage.style.width || activeImage.getAttribute("width") || "auto"
        const height = activeImage.style.height || activeImage.getAttribute("height") || "auto"

        // Update the image attributes
        editor.commands.updateAttributes("draggableImage", {
            style,
            width,
            height,
            "data-align": align,
            "data-position": "inline", // Reset to inline positioning when using alignment
        })
    }

    const removeImage = () => {
        if (!editor || !activeImage) return
        editor.commands.deleteSelection()
        setActiveImage(null)
    }

    if (!editor) {
        return <div className="border rounded-lg p-4 min-h-[300px] flex items-center justify-center">Loading editor...</div>
    }

    return (
        <div className="border rounded-lg p-1 md:p-4 min-h-[300px] relative" ref={editorContainerRef}>
            {/* Hidden file input */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            {/* Upload progress indicator */}
            {uploadProgress !== null && (
                <div className="mb-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                </div>
            )}

            {/* Image toolbar (appears when an image is selected) */}
            {activeImage && !isResizing && !isDragging && (
                <ImageToolbar
                    onAlign={alignImage}
                    onRemove={removeImage}
                    onResize={() => { }} // Not needed as we're using direct manipulation
                />
            )}

            {/* Editor toolbar */}
            <EditorToolbar
                editor={editor}
                onImageUpload={triggerFileInput}
                onLinkAdd={setLink}
                onTableAdd={addTable}
                onCodeBlockAdd={addCodeBlock}
                onHighlightAdd={addHighlight}
                onEmojiAdd={addEmoji}
            />

            {/* Editor content */}
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none"
                style={{
                    minHeight: "300px",
                }}
            />
        </div>
    )
}
