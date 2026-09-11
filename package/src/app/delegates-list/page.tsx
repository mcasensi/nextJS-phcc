"use client";

import { useEffect, useMemo, useState } from "react";

type Delegate = {
    pastor_name: string;
    church_address: string;
    attendeesNames: string;
};

export default function Page1() {
    const LIST_DISABLED = true;

    const [rows, setRows] = useState<Delegate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (LIST_DISABLED) {
            setLoading(false);
            setError(null);
            return;
        }

        const loadDelegates = async () => {
            try {
                const response = await fetch("/api/delegates-list", {
                    cache: "no-store",
                });

                const result = await response.json();

                if (!response.ok || !result.ok) {
                    throw new Error(
                        result.message || "Unable to load delegates.",
                    );
                }

                setRows(result.data ?? []);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load delegates.",
                );
            } finally {
                setLoading(false);
            }
        };

        loadDelegates();
    }, []);

    const filteredRows = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return rows;

        return rows.filter((row) =>
            [row.pastor_name, row.church_address, row.attendeesNames].some(
                (value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(query),
            ),
        );
    }, [rows, search]);

    if (LIST_DISABLED) {
        return (
            <section className="scroll-mt-12 pt-42">
                <div className="container">
                    <h2 className="mb-9 text-center">
                        Delegates List November 2026
                    </h2>

                    <div className="rounded border border-yellow-300 bg-yellow-50 p-6 text-center text-gray-800 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-100">
                        The delegates list is temporarily disabled for
                        maintenance.
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="scroll-mt-12 pt-42">
            <div className="container">
                <h2 className="mb-9 text-center">
                    Delegates List November 2026
                </h2>

                <p className="mb-5 text-center text-lg font-medium text-gray-900 dark:text-white">
                    Below is the list of delegates who have submitted their
                    applications.
                </p>

                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search delegates..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="w-full max-w-md rounded border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />

                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="rounded bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                        >
                            Clear
                        </button>
                    )}

                    <span className="text-sm text-gray-500">
                        {filteredRows.length} result
                        {filteredRows.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {loading && <p>Loading...</p>}

                {error && <p className="text-red-600">Error: {error}</p>}

                {!loading && !error && filteredRows.length === 0 && (
                    <p>No delegates found.</p>
                )}

                {!loading && !error && filteredRows.length > 0 && (
                    <div className="overflow-auto rounded border">
                        <table className="min-w-full border-collapse text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-3 py-2 text-left font-medium">
                                        Pastor Name
                                    </th>
                                    <th className="border px-3 py-2 text-left font-medium">
                                        Church Address
                                    </th>
                                    <th className="border px-3 py-2 text-left font-medium">
                                        Attendees
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRows.map((row, index) => (
                                    <tr
                                        key={`${row.pastor_name}-${index}`}
                                        className="odd:bg-white even:bg-gray-50"
                                    >
                                        <td className="border px-3 py-2 align-top">
                                            {row.pastor_name}
                                        </td>
                                        <td className="border px-3 py-2 align-top">
                                            {row.church_address}
                                        </td>
                                        <td className="border px-3 py-2 align-top">
                                            {row.attendeesNames}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
