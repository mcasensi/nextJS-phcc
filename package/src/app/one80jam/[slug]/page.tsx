"use client";
import { use, useEffect, useState } from "react";
import { one80JamSong } from "../../types/one80JamSong";
import { API_URL } from "@/lib/config";

type Props = {
    params: {
        slug: string;
    };
};

export default function Song({ params }: Props) {
    const [song, setSong] = useState<one80JamSong | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        // Fetch song data based on the slug
        fetch(`${API_URL}/public-one80jam/${params.slug}`)
            .then((response) => response.json())
            .then((data) => {
                setSong(data);
                console.log("Fetched song data:", data);
            })
            .catch((error) => {
                console.log("Error fetching song:", error);
                setNotFound(true);
            });
    }, [params.slug]);

    const downloadPDF = (id: number) => {
        fetch(`${API_URL}/public-one80jam/download-pdf/${id}`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to download PDF");
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${id}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error("Error downloading PDF:", error);
            });
    };

    return (
        <section>
            <div className="container pt-32 text-center">
                <h1 className="text-4xl font-bold mb-8">{params.slug}</h1>
                {notFound ? (
                    <p className="text-gray-500">Song not found.</p>
                ) : (
                    <div className="container">
                        <button
                            className="bg-red-700 hover:bg-red-800 text-white mb-5 font-bold py-2 px-2 rounded"
                            onClick={() => downloadPDF(song?.id)}
                        >
                            <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-10 w-10 text-red-600"
                                >
                                    <path d="M6 2h7l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                                    <path
                                        d="M13 2v6h6"
                                        fill="white"
                                        opacity="0.5"
                                    />
                                </svg>
                                Export PDF
                            </div>
                        </button>
                        <pre className="text-center whitespace-pre-wrap bg-gray-100 p-4 rounded">
                            {song?.lyrics}
                        </pre>
                    </div>
                )}
            </div>
        </section>
    );
}
