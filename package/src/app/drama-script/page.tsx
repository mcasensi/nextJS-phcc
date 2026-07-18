"use client";

import { useEffect, useMemo, useState } from "react";

type DramaScript = {
    title: string;
    filePath: string;
    video_reference: string;
    sfx: string;
    genres: string[];
};

export default function DramaScriptPage() {
    const [dramaScripts, setDramaScripts] = useState<DramaScript[]>([]);
    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [loading, setLoading] = useState(true);
    const [requestForm, setRequestForm] = useState({
        title: "",
        video_reference_link: "",
        sffx_link: "",
        genres: "",
        download_link: "",
    });
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestMsg, setRequestMsg] = useState("");

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
                    sfx: item.sfx ?? item.sound_effects ?? "",
                    title: item.title ?? null,
                    genres: item.genres ?? item.genre ?? [],
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
        () => [
            "All",
            ...Array.from(new Set(dramaScripts.flatMap((s) => s.genres))),
        ],
        [dramaScripts],
    );

    const filtered = dramaScripts.filter((script) => {
        const q = search.toLowerCase();
        const matchesSearch =
            script.filePath.toLowerCase().includes(q) ||
            script.video_reference.toLowerCase().includes(q) ||
            script.genres.some((g) => g.toLowerCase().includes(q));

        const matchesGenre =
            selectedGenre === "All" || script.genres.includes(selectedGenre);

        return matchesSearch && matchesGenre;
    });

    const handleRequestChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRequestForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRequestLoading(true);
        setRequestMsg("");

        try {
            const res = await fetch("/api/drama-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestForm),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok)
                throw new Error(data?.error || "Failed to submit request");

            setRequestMsg("Request sent to Discord channel.");
            setRequestForm({
                title: "",
                video_reference_link: "",
                sffx_link: "",
                genres: "",
                download_link: "",
            });
        } catch (err: any) {
            setRequestMsg(err?.message || "Failed to submit request.");
        } finally {
            setRequestLoading(false);
        }
    };

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
                                Title
                            </th>
                            <th className="px-4 py-2 text-left border-b border-gray-300">
                                Video Reference
                            </th>
                            <th className="px-4 py-2 text-left border-b border-gray-300">
                                SFX
                            </th>
                            <th className="px-4 py-2 text-left border-b border-gray-300">
                                Genres
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
                                    colSpan={5}
                                    className="px-4 py-6 text-center text-gray-400"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : filtered.length > 0 ? (
                            filtered.map((script, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b border-gray-200">
                                        {script.title}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-200">
                                        <a
                                            href={script.video_reference}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                        >
                                            Watch Video
                                        </a>
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-200">
                                        <a
                                            hidden={!script.sfx}
                                            href={script.sfx}
                                            target="_blank"
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                        >
                                            View Soundboard
                                        </a>
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-200">
                                        {script.genres.join(", ")}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-200">
                                        <a
                                            hidden={!script.filePath}
                                            href={script.filePath}
                                            download
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                        >
                                            Download Script
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
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

            {/* Request Entry Form */}
            <section className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                    <h2 className="text-xl font-semibold text-white">
                        Request New Entry
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                        Submit a request for a new Drama script entry.
                    </p>
                </div>

                <form
                    onSubmit={handleRequestSubmit}
                    className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Title
                        </label>
                        <input
                            name="title"
                            value={requestForm.title}
                            onChange={handleRequestChange}
                            placeholder="Enter title"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Video Reference Link
                        </label>
                        <input
                            name="video_reference_link"
                            value={requestForm.video_reference_link}
                            onChange={handleRequestChange}
                            placeholder="https://..."
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            SFFX Link
                        </label>
                        <input
                            name="sffx_link"
                            value={requestForm.sffx_link}
                            onChange={handleRequestChange}
                            placeholder="https://..."
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Genres
                        </label>
                        <input
                            name="genres"
                            value={requestForm.genres}
                            onChange={handleRequestChange}
                            placeholder="Drama, Youth, Christmas"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Download Link
                        </label>
                        <input
                            name="download_link"
                            value={requestForm.download_link}
                            onChange={handleRequestChange}
                            placeholder="https://..."
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={requestLoading}
                            className="inline-flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                            {requestLoading
                                ? "Submitting..."
                                : "Submit Request"}
                        </button>

                        {requestMsg ? (
                            <p className="text-sm text-slate-600">
                                {requestMsg}
                            </p>
                        ) : null}
                    </div>
                </form>
            </section>
        </div>
    );
}
