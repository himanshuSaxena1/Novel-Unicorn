"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const PromoBanner = () => {
    const [timeLeft, setTimeLeft] = useState(180000);

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

                {/* LEFT SECTION */}
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center md:text-left">

                    {/* TIMER */}
                    <div className="flex items-center gap-1 font-bold text-sm md:text-base">
                        <span>{h}</span>:<span>{m}</span>:<span>{s}</span>
                    </div>

                    {/* TEXT */}
                    <span className="text-xs md:text-sm font-medium leading-tight">
                        🛒 Limited Time Sale: Get{" "}
                        <span className="font-bold">25% extra coins</span> on all packs 🎉
                    </span>
                </div>

                {/* CTA */}
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