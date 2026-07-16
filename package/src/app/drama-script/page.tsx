"use client";

import { useEffect, useMemo, useState } from "react";

type DramaScript = {
    filePath: string;
    video_reference: string;
    genre: string;
};

export default function DramaScriptPage() {
    const [dramaScripts, setDramaScripts] = useState<DramaScript[]>([]);
    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDramaScripts = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL;
                if (!baseUrl)
                    throw new Error("Missing NEXT_PUBLIC_ADMIN_API_URL");

                const res = await fetch(
                    `${baseUrl}/public-drama/drama-scripts`,
                    {
                        cache: "no-store",
                    },
                );
                if (!res.ok) throw new Error("Failed to fetch drama scripts");

                const json = await res.json();
                const list = Array.isArray(json) ? json : (json?.data ?? []);

                const normalized: DramaScript[] = list.map((item: any) => ({
                    filePath:
                        item.filePath ?? item.file_path ?? item.pdf_path ?? "",
                    video_reference:
                        item.video_reference ?? item.videoReference ?? "",
                    genre: item.genre ?? "Unknown",
                }));

                setDramaScripts(normalized);
            } catch (error) {
                console.error(error);
                setDramaScripts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDramaScripts();
    }, []);

    const genres = useMemo(
        () => ["All", ...Array.from(new Set(dramaScripts.map((s) => s.genre)))],
        [dramaScripts],
    );

    const filtered = dramaScripts.filter((script) => {
        const q = search.toLowerCase();
        const matchesSearch =
            script.filePath.toLowerCase().includes(q) ||
            script.video_reference.toLowerCase().includes(q) ||
            script.genre.toLowerCase().includes(q);

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
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-6 text-center text-gray-400"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : filtered.length > 0 ? (
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
