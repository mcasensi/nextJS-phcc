"use client";

import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

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
        sfx_link: "",
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
                    title: item.title ?? "",
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
            script.title.toLowerCase().includes(q) ||
            script.filePath.toLowerCase().includes(q) ||
            script.video_reference.toLowerCase().includes(q) ||
            script.genres.some((g) => g.toLowerCase().includes(q));

        const matchesGenre =
            selectedGenre === "All" || script.genres.includes(selectedGenre);

        return matchesSearch && matchesGenre;
    });

    const handleRequestChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRequestForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRequestSubmit = async (e: FormEvent) => {
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

            setRequestMsg("Request sent successfully!");
            setRequestForm({
                title: "",
                video_reference_link: "",
                sfx_link: "",
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
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mt-20">
            {/* Header */}
            <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 sm:p-8 shadow-sm">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                    Drama Scripts
                </h1>
                <p className="mt-2 text-slate-600">
                    Browse, filter, and download scripts for church productions.
                </p>
            </section>

            {/* Filters */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <input
                        type="text"
                        placeholder="Search by title, reference, or genre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:max-w-md rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="text-sm font-medium text-slate-500 hover:text-red-500 underline underline-offset-2"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </section>

            {/* Table */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-slate-700">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold border-b border-slate-200">
                                    Title
                                </th>
                                <th className="px-4 py-3 text-left font-semibold border-b border-slate-200">
                                    Video
                                </th>
                                <th className="px-4 py-3 text-left font-semibold border-b border-slate-200">
                                    SFX
                                </th>
                                <th className="px-4 py-3 text-left font-semibold border-b border-slate-200">
                                    Genres
                                </th>
                                <th className="px-4 py-3 text-left font-semibold border-b border-slate-200">
                                    Download
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-10 text-center text-slate-400"
                                    >
                                        Loading scripts...
                                    </td>
                                </tr>
                            ) : filtered.length > 0 ? (
                                filtered.map((script, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-slate-50/70 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-slate-800">
                                            {script.title || "Untitled"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {script.video_reference ? (
                                                <a
                                                    href={
                                                        script.video_reference
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                                                >
                                                    Watch Video
                                                </a>
                                            ) : (
                                                <span className="text-slate-400">
                                                    N/A
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {script.sfx ? (
                                                <a
                                                    href={script.sfx}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                                                >
                                                    View Soundboard
                                                </a>
                                            ) : (
                                                <span className="text-slate-400">
                                                    N/A
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-700">
                                            {script.genres.length
                                                ? script.genres.join(", ")
                                                : "Uncategorized"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {script.filePath ? (
                                                <a
                                                    href={script.filePath}
                                                    download
                                                    className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                                >
                                                    Download Script
                                                </a>
                                            ) : (
                                                <span className="text-slate-400">
                                                    N/A
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-10 text-center text-slate-400"
                                    >
                                        No results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
                    {filtered.length} result(s) found
                </div>
            </section>

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
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Music Background
                        </label>
                        <input
                            name="sfx_link"
                            value={requestForm.sfx_link}
                            onChange={handleRequestChange}
                            placeholder="https://google_drive_link"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Script Link
                        </label>
                        <input
                            name="download_link"
                            value={requestForm.download_link}
                            onChange={handleRequestChange}
                            placeholder="https://google_drive_link"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={requestLoading}
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
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
