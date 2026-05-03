"use client";
import React from "react";
import dynamic from "next/dynamic";
import { getFilePlugin, RenderDownloadProps } from "@react-pdf-viewer/get-file";

const Worker = dynamic(
    () => import("@react-pdf-viewer/core").then((m) => m.Worker),
    { ssr: false },
);

const Viewer = dynamic(
    () => import("@react-pdf-viewer/core").then((m) => m.Viewer),
    { ssr: false },
);

export default function Conference({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = React.use(params);

    const getFilePluginInstance = getFilePlugin();
    const { Download } = getFilePluginInstance;
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
    ];

    const conference = conferences.find((c) => c.monthYear === slug);

    if (!conference) {
        return (
            <section className="hero container mx-auto mt-25">
                <p className="text-center">Conference not found.</p>
            </section>
        );
    }

    return (
        <div className="mt-23">
            <Download>
                {(action: RenderDownloadProps) => (
                    <button
                        onClick={action.onClick}
                        className="mb-2 w-full inline-block px-6 py-2.5 bg-red-800 text-white font-medium text-xs leading-normal uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-900 active:shadow-lg transition duration-150 ease-in-out"
                    >
                        {conference.btn}
                    </button>
                )}
            </Download>

            <div style={{ height: "80vh" }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer
                        plugins={[getFilePluginInstance]}
                        fileUrl={conference.file}
                    />
                </Worker>
            </div>
        </div>
    );
}
