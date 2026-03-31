"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const PromoBanner = () => {
    const SALE_DURATION = 50 * 60 * 60 * 1000; // 50 hours
    const STORAGE_KEY = "saleEndTime";
    const VERSION_KEY = "saleVersion";
    const CURRENT_VERSION = "v2"; // change this anytime to reset all users

    const getInitialTime = () => {
        if (typeof window === "undefined") return SALE_DURATION / 1000;

        const savedVersion = localStorage.getItem(VERSION_KEY);
        const savedEnd = localStorage.getItem(STORAGE_KEY);

        // 🔥 Force reset if version changed
        if (savedVersion !== CURRENT_VERSION) {
            const newEnd = Date.now() + SALE_DURATION;
            localStorage.setItem(STORAGE_KEY, newEnd.toString());
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
            return Math.floor(SALE_DURATION / 1000);
        }

        // ✅ Normal flow
        if (savedEnd) {
            const remaining = Math.floor((+savedEnd - Date.now()) / 1000);
            return remaining > 0 ? remaining : 0;
        }

        // 🆕 First-time users
        const newEnd = Date.now() + SALE_DURATION;
        localStorage.setItem(STORAGE_KEY, newEnd.toString());
        return Math.floor(SALE_DURATION / 1000);
    };

    const [timeLeft, setTimeLeft] = useState(getInitialTime);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return { h, m, s };
    };

    const { h, m, s } = formatTime(timeLeft);

    return (
        <div className="bg-red-700 text-white w-full">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 px-3 py-2 md:py-3">

                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center md:text-left">

                    <div className="flex items-center gap-1 font-bold text-sm md:text-base">
                        <span>{h}</span>:<span>{m}</span>:<span>{s}</span>
                    </div>

                    <span className="text-xs md:text-sm font-medium leading-tight">
                        🛒 Limited Time Sale: Get{" "}
                        <span className="font-bold">25% extra coins</span> on all packs 🎉
                    </span>
                </div>

                <Link
                    href="/coins"
                    className="bg-orange-500 hover:bg-orange-600 transition px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-semibold whitespace-nowrap"
                >
                    Grab it
                </Link>
            </div>
        </div>
    );
};

export default PromoBanner;