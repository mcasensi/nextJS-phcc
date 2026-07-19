"use client";

import { useEffect, useMemo, useState } from "react";

type BookItem = {
    id: string;
    title: string;
    pdfUrl: string;
    previewUrl: string;
};

export default function Page() {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [letterFilter, setLetterFilter] = useState("All");

    const letters = useMemo(() => {
        const set = new Set<string>();
        books.forEach((b) => {
            const first = (b.title?.trim()?.[0] ?? "#").toUpperCase();
            set.add(/[A-Z]/.test(first) ? first : "#");
        });
        return ["All", ...Array.from(set).sort()];
    }, [books]);

    const filteredBooks = useMemo(() => {
        const q = search.trim().toLowerCase();

        return books.filter((book) => {
            const first = (book.title?.trim()?.[0] ?? "#").toUpperCase();
            const normalizedFirst = /[A-Z]/.test(first) ? first : "#";

            const matchesSearch =
                q.length === 0 ||
                book.title.toLowerCase().includes(q) ||
                book.pdfUrl.toLowerCase().includes(q);

            const matchesLetter =
                letterFilter === "All" || normalizedFirst === letterFilter;

            return matchesSearch && matchesLetter;
        });
    }, [books, search, letterFilter]);

    const handleCopy = async (id: string, url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1200);
        } catch {
            setError("Failed to copy link");
        }
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const base = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "";
                const key = process.env.NEXT_PUBLIC_BIBLE_STORY ?? "";
                const endpoint = base && key ? `${base}/drive/${key}` : "";

                if (!endpoint) throw new Error("Missing env variables");

                const res = await fetch(endpoint, { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch books");

                const json = await res.json();
                const list = Array.isArray(json)
                    ? json
                    : (json?.data ?? json?.items ?? []);

                const normalized: BookItem[] = list
                    .filter((item: any) =>
                        (item.mimeType ?? "").includes("pdf"),
                    )
                    .map((item: any, i: number) => {
                        const id = String(item.id ?? i + 1);
                        const title = String(
                            item.name ?? item.title ?? `Book ${i + 1}`,
                        );
                        const pdfUrl = String(
                            item.webViewLink ??
                                item.url ??
                                item.link ??
                                `https://drive.google.com/file/d/${id}/view`,
                        );
                        const previewUrl = `https://drive.google.com/file/d/${id}/preview`;

                        return { id, title, pdfUrl, previewUrl };
                    });

                setBooks(normalized);
                setError("");
            } catch (e: any) {
                setBooks([]);
                setError(e?.message || "Unexpected error");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    return (
        <section className="mt-25 min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-8 md:px-8 md:py-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                            Bible Story Books
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Browse and preview PDF files from Google Drive
                        </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                        {filteredBooks.length} / {books.length} file
                        {books.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* How to Create a Mini Book */}
                <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 md:p-5">
                    <h2 className="text-base md:text-lg font-bold text-amber-900">
                        How to Create a Mini Book
                    </h2>
                    <ol className="mt-3 list-decimal pl-5 space-y-2 text-sm text-amber-900">
                        <li>
                            Print the PDF with the following settings:
                            <ul className="mt-1 list-disc pl-5 text-amber-800">
                                <li>Pages per sheet: 2</li>
                            </ul>
                        </li>
                        <li>
                            The last two pages should print at the back of the
                            paper.
                        </li>
                    </ol>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 bg-slate-50/70 p-3 md:p-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search title or link..."
                                className="w-full md:max-w-md rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                            />
                            <select
                                value={letterFilter}
                                onChange={(e) =>
                                    setLetterFilter(e.target.value)
                                }
                                className="w-full md:w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                            >
                                {letters.map((letter) => (
                                    <option key={letter} value={letter}>
                                        {letter === "All"
                                            ? "All Letters"
                                            : letter}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden">
                        {loading ? (
                            <div className="px-4 py-10 text-center text-slate-500">
                                Loading books...
                            </div>
                        ) : error ? (
                            <div className="px-4 py-10 text-center text-red-600">
                                {error}
                            </div>
                        ) : filteredBooks.length === 0 ? (
                            <div className="px-4 py-10 text-center text-slate-500">
                                No matching books found.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredBooks.map((book, idx) => (
                                    <div
                                        key={book.id}
                                        className="p-4 space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-semibold text-slate-800 leading-snug">
                                                {idx + 1}. {book.title}
                                            </p>
                                        </div>

                                        <a
                                            href={book.pdfUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block truncate text-sm text-blue-600 hover:underline"
                                            title={book.pdfUrl}
                                        >
                                            View PDF
                                        </a>

                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() =>
                                                    setPreviewUrl(
                                                        book.previewUrl,
                                                    )
                                                }
                                                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition font-medium"
                                            >
                                                Preview
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleCopy(
                                                        book.id,
                                                        book.pdfUrl,
                                                    )
                                                }
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-medium"
                                                title="Copy PDF link"
                                                aria-label="Copy PDF link"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="h-4 w-4"
                                                >
                                                    <rect
                                                        x="9"
                                                        y="9"
                                                        width="13"
                                                        height="13"
                                                        rx="2"
                                                    />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </svg>
                                                {copiedId === book.id
                                                    ? "Copied"
                                                    : "Copy"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr className="text-slate-600">
                                    <th className="px-4 py-3 text-left font-semibold w-16">
                                        #
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        PDF Link
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold w-56">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-10 text-center text-slate-500"
                                        >
                                            Loading books...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-10 text-center text-red-600"
                                        >
                                            {error}
                                        </td>
                                    </tr>
                                ) : filteredBooks.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-10 text-center text-slate-500"
                                        >
                                            No matching books found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBooks.map((book, idx) => (
                                        <tr
                                            key={book.id}
                                            className="border-t border-slate-100 odd:bg-white even:bg-slate-50/30 hover:bg-blue-50/40 transition"
                                        >
                                            <td className="px-4 py-3 font-medium text-slate-600">
                                                {idx + 1}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-800">
                                                {book.title}
                                            </td>
                                            <td className="px-4 py-3 max-w-[320px]">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        window.open(
                                                            book.pdfUrl,
                                                            "_blank",
                                                            "noopener,noreferrer",
                                                        )
                                                    }
                                                    className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 transition"
                                                    title={book.pdfUrl}
                                                >
                                                    View PDF
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() =>
                                                            setPreviewUrl(
                                                                book.previewUrl,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition font-medium"
                                                    >
                                                        Preview
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleCopy(
                                                                book.id,
                                                                book.pdfUrl,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-medium"
                                                        title="Copy PDF link"
                                                        aria-label="Copy PDF link"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            className="h-4 w-4"
                                                        >
                                                            <rect
                                                                x="9"
                                                                y="9"
                                                                width="13"
                                                                height="13"
                                                                rx="2"
                                                            />
                                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                        </svg>
                                                        {copiedId === book.id
                                                            ? "Copied"
                                                            : "Copy"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {previewUrl && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4"
                    onClick={() => setPreviewUrl("")}
                >
                    <div
                        className="w-full max-w-6xl h-[88vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b bg-slate-50">
                            <p className="text-sm md:text-base font-semibold text-slate-700">
                                PDF Preview
                            </p>
                            <div className="flex items-center gap-2">
                                <a
                                    href={previewUrl.replace(
                                        "/preview",
                                        "/view",
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 text-sm"
                                >
                                    Open in new tab
                                </a>
                                <button
                                    onClick={() => setPreviewUrl("")}
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        <iframe
                            src={previewUrl}
                            className="w-full h-[calc(88vh-56px)]"
                            title="PDF Preview"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
