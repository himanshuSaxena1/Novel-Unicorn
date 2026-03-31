"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const PromoBanner = () => {
    const SALE_DURATION = 3000000; // ms (3 minutes)

    const getInitialTime = () => {
        if (typeof window === "undefined") return SALE_DURATION;

        const savedEnd = localStorage.getItem("saleEndTime");

        if (savedEnd) {
            const remaining = Math.floor((+savedEnd - Date.now()) / 1000);
            return remaining > 0 ? remaining : 0;
        } else {
            const newEnd = Date.now() + SALE_DURATION;
            localStorage.setItem("saleEndTime", newEnd.toString());
            return Math.floor(SALE_DURATION / 1000);
        }
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