"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ExpandableSummaryProps {
    summary: string;
    summaryLength?: number; // default = 300
}

export function ExpandableSummary({
    summary,
    summaryLength = 300,
}: ExpandableSummaryProps) {
    const [isOpen, setIsOpen] = useState(false);

    const isSummaryLong = summary.length > summaryLength;
    const truncatedSummary = isSummaryLong
        ? `${summary.slice(0, summaryLength)}...`
        : summary;

    return (
        <div className="space-y-2">
            {/* Desktop: Always show full summary */}
            {/* <p className="text-muted-foreground text-sm 2xl:text-base leading-relaxed whitespace-pre-line hidden md:block">
                {summary || "No summary available for this novel."}
            </p> */}

            {/* Mobile: Truncate/collapse if necessary */}
            <div className="">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <p className="text-muted-foreground text-[13px] lg:text-[15px] leading-relaxed whitespace-pre-line">
                        {isOpen ? summary : truncatedSummary}
                    </p>

                    {isSummaryLong && (
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 mt-2 h-auto p-0 text-primary hover:bg-transparent hover:text-primary/80"
                            >
                                {isOpen ? (
                                    <>
                                        <span>Show less</span>
                                        <ChevronUp className="h-4 w-4" />
                                    </>
                                ) : (
                                    <>
                                        <span>Read more</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </CollapsibleTrigger>
                    )}
                </Collapsible>
            </div>
        </div>
    );
}
