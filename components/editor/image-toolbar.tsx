"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Maximize2, Minimize2, Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { useState } from "react"

interface ImageToolbarProps {
    onResize: (width: string) => void
    onAlign: (align: "left" | "center" | "right") => void
    onRemove: () => void
    currentWidth?: string
    currentAlign?: string
}

export function ImageToolbar({
    onResize,
    onAlign,
    onRemove,
    currentWidth = "100%",
    currentAlign = "left",
}: ImageToolbarProps) {
    const [showSlider, setShowSlider] = useState(false)
    const [sliderValue, setSliderValue] = useState(() => {
        // Parse current width to initialize slider
        const widthNum = Number.parseInt(currentWidth)
        return widthNum ? Math.min(Math.max(widthNum, 10), 100) : 100
    })

    const handleSliderChange = (value: number[]) => {
        setSliderValue(value[0])
        onResize(`${value[0]}%`)
    }

    return (
        <div className="absolute z-10 bg-white shadow-lg rounded-md p-2 flex flex-col gap-2 mb-2">
            <div className="flex gap-1 items-center">
                <Button
                    size="sm"
                    variant={currentAlign === "left" ? "default" : "outline"}
                    onClick={() => onAlign("left")}
                    title="Align left"
                    className="h-8 w-8 p-0"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant={currentAlign === "center" ? "default" : "outline"}
                    onClick={() => onAlign("center")}
                    title="Align center"
                    className="h-8 w-8 p-0"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant={currentAlign === "right" ? "default" : "outline"}
                    onClick={() => onAlign("right")}
                    title="Align right"
                    className="h-8 w-8 p-0"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-200 mx-1"></div>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSlider(!showSlider)}
                    title="Resize image"
                    className="h-8 w-8 p-0"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>

                <Button size="sm" variant="destructive" onClick={onRemove} title="Remove image" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {showSlider && (
                <div className="flex items-center gap-2 px-2 pt-1">
                    <Minimize2 className="h-3 w-3 text-gray-500" />
                    <Slider
                        value={[sliderValue]}
                        min={10}
                        max={100}
                        step={5}
                        onValueChange={handleSliderChange}
                        className="w-32"
                    />
                    <Maximize2 className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-500 min-w-[30px]">{sliderValue}%</span>
                </div>
            )}
        </div>
    )
}
