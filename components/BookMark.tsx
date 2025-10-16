"use client"
import React, { useState } from 'react';
import { Button } from './ui/button';
import { BookmarkIcon } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface BookMarkProps {
    novelId: string;
    novelSlug: string;
    isBookMarked: boolean;
}

const BookMark = ({ novelId, isBookMarked }: BookMarkProps) => {
    const [bookmarked, setBookmarked] = useState(isBookMarked);
    const [loading, setLoading] = useState(false);

    const toggleBookmark = async () => {
        setLoading(true);
        try {
            const res = await api.post(`/novels/bookmark/${novelId}`);
            if (res.status === 200) {
                setBookmarked(res.data.bookmarked);
                toast.success(
                    res.data.bookmarked ? 'Novel saved successfully.' : 'Novel removed from bookmarks.'
                );
            } else {
                toast.error('Failed to update bookmark.');
            }
        } catch (error) {
            console.error('[BOOKMARK_ERROR]', error);
            toast.error('Failed to update bookmark.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={toggleBookmark}
            variant="outline"
            disabled={loading}
            className="flex items-center gap-1"
        >
            <BookmarkIcon className={`w-4 h-4 ${bookmarked ? "fill-white" : "fill-none"}`} />
        </Button>
    );
};

export default BookMark;
