"use client";
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

export default function PdfViewer({ file }: { file: string }) {
    const [numPages, setNumPages] = useState(0);
    const [width, setWidth] = useState(0);
    const [error, setError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.clientWidth);
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return (
        <div ref={containerRef} className="w-full">
            {error ? (
                <p className="text-center text-red-600">Failed to load PDF.</p>
            ) : (
                <Document
                    file={file}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    onLoadError={() => setError(true)}
                    loading={<p className="text-center">Loading PDF...</p>}
                >
                    {Array.from({ length: numPages }, (_, i) => (
                        <Page
                            key={i + 1}
                            pageNumber={i + 1}
                            width={width || undefined}
                            className="mb-4 shadow"
                        />
                    ))}
                </Document>
            )}
        </div>
    );
}
