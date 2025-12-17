"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Flag, Loader2 } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/axios"

interface ReportIssueDialogProps {
    chapterId?: string
    novelId?: string
    type?: "chapter" | "novel"
}

const issueTypes = [
    { value: "TRANSLATION_ERROR", label: "Translation Error" },
    { value: "FORMATTING_ERROR", label: "Formatting Error" },
    { value: "MISSING_CONTENT", label: "Missing Content" },
    { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content" },
    { value: "TECHNICAL_ISSUE", label: "Technical Issue" },
    { value: "OTHER", label: "Other" },
]

export function ReportIssueDialog({ chapterId, novelId, type = "chapter" }: ReportIssueDialogProps) {
    const [open, setOpen] = useState(false)
    const [issueType, setIssueType] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!issueType || !description.trim()) {
            toast.error("Please fill in all fields")
            return
        }

        try {
            setIsSubmitting(true)
            const response = await api.post("/issue/report", {
                type: issueType,
                description,
                chapterId,
                novelId,
            })

            const data = await response.data

            if (response.status !== 200 || !data.success) {
                throw new Error(data.error || "Failed to submit report")
            }

            toast.success("Report submitted successfully")
            setOpen(false)
            setIssueType("")
            setDescription("")
        } catch (error: any) {
            toast.error(error.message || "Failed to submit report")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Flag className="h-4 w-4" />
                    Report Issue
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Report an Issue</DialogTitle>
                    <DialogDescription>Help us improve by reporting any issues you encounter with this {type}.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="issue-type">Issue Type</Label>
                        <Select value={issueType} onValueChange={setIssueType}>
                            <SelectTrigger id="issue-type">
                                <SelectValue placeholder="Select issue type" />
                            </SelectTrigger>
                            <SelectContent>
                                {issueTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Please describe the issue in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[120px] resize-none"
                        />
                    </div>
                </div>
                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || description.trim() === "" || issueType === ""}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
