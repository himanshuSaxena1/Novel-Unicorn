// @ts-nocheck
"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import TextAlign from "@tiptap/extension-text-align"
import { useEffect, useMemo } from "react"


// Interface for ResizableImage attributes
interface ResizableImageAttributes {
  src: string | null;
  alt: string | null;
  title: string | null;
  width: string | number | null;
  height: string | number | null;
  style: string | null;
  "data-align": string | null;
}

// Custom image extension that preserves width and height attributes
const ResizableImage = Image.extend({
  addAttributes() {
    return {
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
        default: null,
        renderHTML: (attributes: ResizableImageAttributes) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: null,
        renderHTML: (attributes: ResizableImageAttributes) => ({
          height: attributes.height,
        }),
      },
      style: {
        default: null,
        renderHTML: (attributes: ResizableImageAttributes) => ({
          style: attributes.style,
        }),
      },
      "data-align": {
        default: null,
        renderHTML: (attributes: ResizableImageAttributes) => ({
          "data-align": attributes["data-align"],
        }),
      },
    };
  },
});

interface RichTextRendererProps {
    content: string
    className?: string
}

export function RichTextRenderer({ content, className = "" }: RichTextRendererProps) {
    // Memoize extensions to prevent unnecessary rerenders
    const extensions = useMemo(
        () => [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                    HTMLAttributes: {
                        class: "font-bold text-foreground dark:text-[#c0b7b7]",
                    },
                },
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc pl-5 my-2",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal pl-5 my-2",
                    },
                },
                listItem: {
                    HTMLAttributes: {
                        class: "leading-relaxed",
                    },
                },
                paragraph: {
                    HTMLAttributes: {
                        class: "my-3 leading-relaxed text-foreground dark:text-[#c0b7b7]",
                    },
                },
                code: {
                    HTMLAttributes: {
                        class: "bg-muted rounded px-1.5 py-0.5 font-mono text-sm",
                    },
                },
                codeBlock: {
                    HTMLAttributes: {
                        class: "bg-muted rounded p-3 font-mono text-sm my-3",
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: "border-l-4 border-muted-foreground pl-4 my-3 italic",
                    },
                },
            }),
            TextStyle,
            Color.configure({
                types: ["textStyle"],
            }),
            TextAlign.configure({
                types: ["heading", "paragraph", "image"],
                alignments: ["left", "center", "right"],
            }),
            // Use ResizableImage instead of Image to preserve width/height
            ResizableImage.configure({
                HTMLAttributes: {
                    class: "rounded-lg h-auto mx-auto my-4",
                },
                // Don't add default width to allow the width attribute to take effect
            }),
            Link.configure({
                HTMLAttributes: {
                    class: "text-primary hover:underline",
                    rel: "noopener noreferrer",
                    target: "_blank",
                },
            }),
        ],
        [],
    )

    const editor = useEditor({
        extensions,
        content,
        editable: false,
        editorProps: {
            attributes: {
                class: "outline-none",
            },
        },
        immediatelyRender: false,
    })

    // Update content when it changes
    useEffect(() => {
        if (editor && content) {
            // Only update if content has changed to prevent unnecessary rerenders
            if (editor.getHTML() !== content) {
                editor.commands.setContent(content)
            }
        }
    }, [editor, content])

    // Process content to ensure image sizes are preserved
    useEffect(() => {
        if (editor) {
            // Find all images and ensure their width attributes are applied as inline styles
            const images = editor.view.dom.querySelectorAll("img[width]")
            images.forEach((img) => {
                const imageElement = img as HTMLImageElement
                const width = imageElement.getAttribute("width")
                if (width) {
                    // If width is a percentage or has units, use it directly
                    if (width.includes("%") || width.includes("px")) {
                        imageElement.style.width = width
                    }
                    // If width is just a number, assume pixels
                    else if (!isNaN(Number(width))) {
                        imageElement.style.width = `${width}px`
                    }
                }
            })
        }
    }, [editor, content])

    if (!editor) {
        return (
            <div className={`space-y-4 animate-pulse ${className}`}>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
                        style={{ width: `${i % 2 ? "90%" : "100%"}` }}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className={`prose dark:prose-invert max-w-none ${className}`}>
            <style jsx global>{`
            .ProseMirror {
              user-select: none; /* Prevent text selection */
              -webkit-user-select: none; /* Safari */
              -moz-user-select: none; /* Firefox */
              -ms-user-select: none; /* IE 10+ */
              h1 {
                @apply text-3xl md:text-4xl font-bold my-4;
              }
              h2 {
                @apply text-2xl md:text-3xl font-bold my-4;
              }
              h3 {
                @apply text-xl md:text-2xl font-bold my-3;
              }
              h4 {
                @apply text-lg md:text-xl font-bold my-3;
              }
              h5 {
                @apply text-base md:text-lg font-bold my-2;
              }
              h6 {
                @apply text-sm md:text-base font-bold my-2;
              }
              p {
                @apply my-3 leading-relaxed text-foreground dark:text-[#c0b7b7];
              }
              ul {
                @apply list-disc pl-5 my-2;
              }
              ol {
                @apply list-decimal pl-5 my-2;
              }
              li {
                @apply leading-relaxed my-1;
              }
              img {
                @apply rounded-lg h-auto my-4 mx-auto;
                max-width: 100%;
              }
              /* Handle width attribute */
              img[width] {
                width: attr(width);
              }
              /* Handle percentage widths */
              img[width="50%"] {
                width: 50%;
              }
              img[width="100%"] {
                width: 100%;
              }
              /* Handle pixel widths */
              img[width*="px"] {
                width: var(--width);
              }
              /* Handle inline styles */
              img[style*="width"] {
                /* Width is already set via style */
              }
              /* Handle alignment */
              img[style*="text-align: center"] {
                @apply mx-auto;
              }
              img[style*="text-align: right"] {
                @apply ml-auto mr-0;
              }
              img[style*="text-align: left"] {
                @apply mr-auto ml-0;
              }
              img[data-align="center"] {
                @apply mx-auto;
              }
              img[data-align="right"] {
                @apply ml-auto mr-0;
              }
              img[data-align="left"] {
                @apply mr-auto ml-0;
              }
              /* Handle float styles */
              img[style*="float: right"] {
                @apply float-right ml-4;
              }
              img[style*="float: left"] {
                @apply float-left mr-4;
              }
              a {
                @apply text-primary hover:underline;
              }
              pre {
                @apply bg-muted rounded p-3 my-3 overflow-x-auto;
              }
              code {
                @apply bg-muted rounded px-1.5 py-0.5 font-mono text-sm;
              }
              blockquote {
                @apply border-l-4 border-muted-foreground pl-4 my-3 italic;
              }
              hr {
                @apply border-t border-muted my-4;
              }
              [data-text-align="center"] {
                @apply text-center;
              }
              [data-text-align="right"] {
                @apply text-right;
              }
              [data-text-align="left"] {
                @apply text-left;
              }
            }
          `}</style>
            <EditorContent editor={editor} />
        </div>
    )
}
