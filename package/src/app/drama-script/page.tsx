"use client";

import { useState } from "react";

const dramaScripts = [
    {
        filePath: "/scripts/drama1.pdf",
        video_reference: "https://youtube.com/watch?v=example1",
        genre: "Tragedy",
    },
    {
        filePath: "/scripts/drama2.pdf",
        video_reference: "https://youtube.com/watch?v=example2",
        genre: "Comedy",
    },
    {
        filePath: "/scripts/drama3.pdf",
        video_reference: "https://youtube.com/watch?v=example3",
        genre: "Romance",
    },
    {
        filePath: "/scripts/drama4.pdf",
        video_reference: "https://youtube.com/watch?v=example4",
        genre: "Tragedy",
    },
];

const genres = [
    "All",
    ...Array.from(new Set(dramaScripts.map((s) => s.genre))),
];

export default function DramaScriptPage() {
    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");

    const filtered = dramaScripts.filter((script) => {
        const matchesSearch =
            script.filePath.toLowerCase().includes(search.toLowerCase()) ||
            script.video_reference
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            script.genre.toLowerCase().includes(search.toLowerCase());

        const matchesGenre =
            selectedGenre === "All" || script.genre === selectedGenre;

        return matchesSearch && matchesGenre;
    });

    return (
        <div className="p-6 mt-25">
            <h1 className="text-2xl font-bold mb-4">Drama Scripts</h1>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {genres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
                {(search || selectedGenre !== "All") && (
                    <button
                        onClick={() => {
                            setSearch("");
                            setSelectedGenre("All");
                        }}
                        className="text-sm text-gray-500 hover:text-red-500 underline"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left border-b border-gray-300">
                                File Path
                            </th>
                            <th className="px-4 py-2 text-left border-b border-gray-300">
                                Video Reference
                            </th>
                            <th className="px-4 py-2 text-left border-b border-gray-300">
                                Genre
                            </th>
                            <th className="px-4 py-2 text-left border-b border-gray-300">
                                Download
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((script, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b border-gray-200">
                                        {script.filePath}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-200">
                                        <a
                                            href={script.video_reference}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {script.video_reference}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-200">
                                        {script.genre}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-200">
                                        <a
                                            href={script.filePath}
                                            download
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                        >
                                            Download PDF
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-6 text-center text-gray-400"
                                >
                                    No results found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <p className="text-sm text-gray-400 mt-2">
                    {filtered.length} result(s) found
                </p>
            </div>
        </div>
    );
}
