"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import api from "@/lib/axios";
import BookMark from "@/components/BookMark";
import Image from "next/image";
import Link from "next/link";

interface Novel {
  novel: {
    id: string;
    title: string;
    slug: string;
    cover: string;
    author: { username: string; id: string };
    isBookmarked: boolean;
  }
}

const LibraryPage = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedNovels = async () => {
      try {
        const res = await api.get("/bookmarks");
        setNovels(res.data);
        console.log(res.data);

      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedNovels();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-lg font-medium">Loading your bookmarks...</p>
      </div>
    );
  }

  if (novels.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] text-center">
        <p className="text-xl font-semibold mb-2">No bookmarks yet!</p>
        <p className="text-gray-500">Start exploring novels and save your favorites here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-[70vh]">
      <h1 className="text-xl 2xl:text-3xl font-bold mb-6">Your Bookmarked Novels</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-6 w-full ">
        {novels.map((novel) => (
          <div
            key={novel.novel.id}
            className="relative shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-full h-60 relative rounded-lg overflow-hidden">
              <Image
                src={novel.novel.cover || 'https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg'}
                alt={novel.novel.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="px-2 flex flex-col justify-between">
              <div>
                <h2 className="text-sm md:text-lg font-semibold line-clamp-2">{novel.novel.title}</h2>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <Link href={`/novel/${novel.novel.slug}`} className="border border-black dark:border-white  px-2 py-1.5 rounded-md">
                  Read
                </Link>
                <BookMark
                  novelId={novel.novel.id}
                  novelSlug={novel.novel.slug}
                  isBookMarked={novel.novel.isBookmarked}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
