"use client";
import React from "react";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("@/components/PdfViewer"), {
    ssr: false,
});

export default function Conference({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = React.use(params);

    var conferences = [
        {
            monthYear: "052022",
            btn: "Click here to Download SEASON OF REVIVAL - MAY 2022 Song Sheet",
            file: "/images/conference/May 2022.pdf",
        },
        {
            monthYear: "112022",
            btn: "Click here to Download Advance - November 2022 Song Sheet",
            file: "/images/conference/November 2022.pdf",
        },
        {
            monthYear: "052023",
            btn: "Click here to Download Fulfilling our Task - May 2023 Song Sheet",
            file: "/images/conference/MAY 2023.pdf",
        },
        {
            monthYear: "122023",
            btn: "Click here to Download Mission Ready! - December 2023 Song Sheet",
            file: "/images/conference/December 2023.pdf",
        },
        {
            monthYear: "052024",
            btn: "Click here to Regions Beyond! - May 2024 Song Sheet",
            file: "/images/conference/May 2024.pdf",
        },
        {
            monthYear: "112024",
            btn: "Click here to Download - November 2024 Song Sheet",
            file: "/images/conference/112024.pdf",
        },
        {
            monthYear: "052025",
            btn: "Click here to Download - May 2025 Song Sheet",
            file: "/images/conference/May2025.pdf",
        },
        {
            monthYear: "112025",
            btn: "Click here to Download - November 2025 Song Sheet",
            file: "/images/conference/Nov2025.pdf",
        },
        {
            monthYear: "052026",
            btn: "Click here to Download - May 2026 Song Sheet",
            file: "/images/conference/May 2026.pdf",
        },
        {
            monthYear: "112026",
            btn: "Click here to Download - November 2026 Song Sheet",
            file: "/images/conference/Nov2026.pdf",
        },
    ];

    const conference = conferences.find((c) => c.monthYear === slug);

    if (!conference) {
        return (
            <section className="hero container mx-auto mt-25">
                <p className="text-center">Conference not found.</p>
            </section>
        );
    }

    const fileUrl = encodeURI(conference.file);

    return (
        <section className="container mx-auto mt-25 px-4">
            <PdfViewer file={fileUrl} />
            <p className="mt-4 text-center">
                <a
                    href={fileUrl}
                    download={conference.file.split("/").pop()}
                    className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded bg-blue-600 px-6 py-3 text-white shadow-lg hover:bg-blue-700"
                >
                    <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v4h14v-4"
                        />
                    </svg>
                    Download PDF
                </a>
            </p>
        </section>
    );
}
