"use client";
import { useState } from "react";

const pages = [
    {
        id: 1,
        title: "Genesis",
        testament: "Old",
        content: "In the beginning, God created the heavens and the earth...",
        bg: "bg-amber-50",
    },
    {
        id: 2,
        title: "The Creation",
        testament: "Old",
        content: "And God said, 'Let there be light,' and there was light...",
        bg: "bg-yellow-50",
    },
    {
        id: 3,
        title: "Noah's Ark",
        testament: "Old",
        content:
            "God told Noah to build an ark to save his family and animals...",
        bg: "bg-blue-50",
    },
    {
        id: 4,
        title: "Moses",
        testament: "Old",
        content: "Moses led the Israelites out of Egypt through the Red Sea...",
        bg: "bg-green-50",
    },
    {
        id: 5,
        title: "David & Goliath",
        testament: "Old",
        content:
            "Young David defeated the giant Goliath with a single stone...",
        bg: "bg-purple-50",
    },
    {
        id: 6,
        title: "The Birth of Jesus",
        testament: "New",
        content: "Jesus was born in Bethlehem, in a manger, as angels sang...",
        bg: "bg-sky-50",
    },
    {
        id: 7,
        title: "The Last Supper",
        testament: "New",
        content:
            "Jesus shared bread and wine with his disciples before his crucifixion...",
        bg: "bg-rose-50",
    },
    {
        id: 8,
        title: "The Resurrection",
        testament: "New",
        content:
            "On the third day, Jesus rose from the dead, victorious over death...",
        bg: "bg-orange-50",
    },
    {
        id: 9,
        title: "Jonah & the Whale",
        testament: "Old",
        content:
            "Jonah was swallowed by a great fish after fleeing from God's call...",
        bg: "bg-teal-50",
    },
    {
        id: 10,
        title: "The Good Samaritan",
        testament: "New",
        content:
            "A Samaritan showed mercy to a wounded stranger on the road...",
        bg: "bg-lime-50",
    },
];

export default function BibleStory() {
    const [currentPage, setCurrentPage] = useState(0);
    const [flipping, setFlipping] = useState(false);
    const [direction, setDirection] = useState<"next" | "prev">("next");
    const [showTable, setShowTable] = useState(true);
    const [filter, setFilter] = useState<"All" | "Old" | "New">("All");

    const flipPage = (dir: "next" | "prev") => {
        if (flipping) return;
        if (dir === "next" && currentPage >= pages.length - 1) return;
        if (dir === "prev" && currentPage <= 0) return;

        setDirection(dir);
        setFlipping(true);

        setTimeout(() => {
            setCurrentPage((prev) => (dir === "next" ? prev + 1 : prev - 1));
            setFlipping(false);
        }, 400);
    };

    const goToPage = (index: number) => {
        if (flipping) return;
        setDirection(index > currentPage ? "next" : "prev");
        setCurrentPage(index);
        setShowTable(false);
    };

    const filteredPages = pages.filter(
        (p) => filter === "All" || p.testament === filter,
    );

    const page = pages[currentPage];

    return (
        <section className="min-h-screen bg-stone-100 flex flex-col items-center justify-center py-20 px-4">
            <h1 className="text-3xl font-bold mb-4 text-amber-800 tracking-wide">
                📖 Bible Story Book
            </h1>

            {/* Toggle Table Button */}
            <button
                onClick={() => setShowTable(!showTable)}
                className="mb-8 px-4 py-1.5 text-sm bg-amber-100 border border-amber-400 text-amber-800 rounded-full hover:bg-amber-200 transition font-medium"
            >
                {showTable ? "✕ Close Stories List" : "📋 Browse All Stories"}
            </button>

            {/* Stories Table */}
            {showTable && (
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-amber-200 mb-10 overflow-hidden">
                    {/* Filter Tabs */}
                    <div className="flex border-b border-amber-100 bg-amber-50">
                        {(["All", "Old", "New"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`flex-1 py-2.5 text-sm font-semibold transition ${
                                    filter === tab
                                        ? "bg-amber-700 text-white"
                                        : "text-amber-700 hover:bg-amber-100"
                                }`}
                            >
                                {tab === "All"
                                    ? "All Stories"
                                    : `${tab} Testament`}
                            </button>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="max-h-72 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-amber-50 border-b border-amber-200">
                                <tr>
                                    <th className="text-left px-4 py-2 text-amber-700 font-semibold w-10">
                                        #
                                    </th>
                                    <th className="text-left px-4 py-2 text-amber-700 font-semibold">
                                        Story Title
                                    </th>
                                    <th className="text-left px-4 py-2 text-amber-700 font-semibold">
                                        Testament
                                    </th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPages.map((p, i) => {
                                    const realIndex = pages.findIndex(
                                        (pg) => pg.id === p.id,
                                    );
                                    const isActive = realIndex === currentPage;
                                    return (
                                        <tr
                                            key={p.id}
                                            className={`border-b border-amber-50 transition ${
                                                isActive
                                                    ? "bg-amber-100"
                                                    : "hover:bg-stone-50"
                                            }`}
                                        >
                                            <td className="px-4 py-3 text-amber-400 font-mono">
                                                {p.id}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {isActive && (
                                                    <span className="mr-1">
                                                        📄
                                                    </span>
                                                )}
                                                {p.title}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                        p.testament === "Old"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-sky-100 text-sky-700"
                                                    }`}
                                                >
                                                    {p.testament}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() =>
                                                        goToPage(realIndex)
                                                    }
                                                    disabled={isActive}
                                                    className="text-xs px-3 py-1 bg-amber-700 text-white rounded-full hover:bg-amber-800 disabled:opacity-40 disabled:cursor-default transition"
                                                >
                                                    {isActive
                                                        ? "Reading"
                                                        : "Read →"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-center text-xs text-amber-400 py-2">
                        {filteredPages.length} stories available
                    </p>
                </div>
            )}

            {/* Book Container */}
            <div
                className="relative w-80 h-96"
                style={{ perspective: "1000px" }}
            >
                <div
                    style={{
                        transformStyle: "preserve-3d",
                        transition: "transform 0.4s ease-in-out",
                        transform: flipping
                            ? direction === "next"
                                ? "rotateY(-180deg)"
                                : "rotateY(180deg)"
                            : "rotateY(0deg)",
                        position: "relative",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {/* Front Face */}
                    <div
                        className={`absolute inset-0 ${page.bg} rounded-r-lg shadow-2xl border border-amber-200 flex flex-col p-8`}
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-amber-700 rounded-l-sm" />
                        <div className="ml-4">
                            <p className="text-xs text-amber-600 uppercase tracking-widest mb-2">
                                Chapter {page.id}
                            </p>
                            <h2 className="text-2xl font-bold text-amber-900 mb-6 border-b border-amber-300 pb-4">
                                {page.title}
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-sm">
                                {page.content}
                            </p>
                        </div>
                        <div className="mt-auto ml-4 space-y-2">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-px bg-amber-200 w-full"
                                />
                            ))}
                        </div>
                        <p className="text-center text-xs text-amber-500 mt-3 ml-4">
                            — {page.id} —
                        </p>
                    </div>

                    {/* Back Face */}
                    <div
                        className={`absolute inset-0 ${page.bg} rounded-r-lg shadow-2xl border border-amber-200 flex items-center justify-center`}
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-amber-700 rounded-l-sm" />
                        <p className="text-amber-400 text-4xl">✝</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-10">
                <button
                    onClick={() => flipPage("prev")}
                    disabled={currentPage === 0 || flipping}
                    className="px-5 py-2 bg-amber-700 text-white rounded-full font-semibold shadow hover:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    ← Prev
                </button>
                <span className="text-amber-800 font-medium text-sm">
                    {currentPage + 1} / {pages.length}
                </span>
                <button
                    onClick={() => flipPage("next")}
                    disabled={currentPage === pages.length - 1 || flipping}
                    className="px-5 py-2 bg-amber-700 text-white rounded-full font-semibold shadow hover:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    Next →
                </button>
            </div>

            {/* Page dots */}
            <div className="flex gap-2 mt-6 flex-wrap justify-center">
                {pages.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToPage(i)}
                        className={`w-2.5 h-2.5 rounded-full transition ${
                            i === currentPage ? "bg-amber-700" : "bg-amber-300"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
