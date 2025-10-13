// components/DeleteButton.tsx
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast'
import api from "@/lib/axios";

interface DeleteButtonProps {
    id: string;
    onDeleted?: () => void;
}

export function ChapterDeleteButton({ id, onDeleted }: DeleteButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await api.delete(`/chapters/${id}`);

            if (!res.status || res.status !== 200) throw new Error("Failed to delete");

            toast.success("Deleted successfully");
            setOpen(false);
            onDeleted?.();
        } catch (err) {
            toast.error("Error deleting item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DropdownMenuItem
                className="text-red-600"
                onSelect={(e) => {
                    e.preventDefault();
                    setOpen(true);
                }}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
            </DropdownMenuItem>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        This action cannot be undone. This will permanently delete the item.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
