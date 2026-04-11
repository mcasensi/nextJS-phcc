"use client";
import { useEffect, useState } from "react";

interface Delegate {
    id: string;
    email_address: string;
    mobile: string;
    status: string;
    expected_day_of_arrival: string;
    expected_time_of_arrival: string;
    attendees: {
        id: string;
        name: string;
        age: string;
    }[];
}

const ITEMS_PER_PAGE = 20;

const STATUS_COLORS: Record<string, string> = {
    approved: "bg-green-100 text-green-800",
    opened: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    received: "bg-blue-100 text-blue-800",
};

const getStatusColor = (status: string): string => {
    return STATUS_COLORS[status.toLowerCase()] || "bg-gray-100 text-gray-800";
};

export default function DelegatesListPage() {
    const [delegates, setDelegates] = useState<Delegate[]>([]);
    const [filteredDelegates, setFilteredDelegates] = useState<Delegate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchDelegates = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/public-delegates/`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch delegates");
            }
            const data = await response.json();
            setDelegates(data);
            setFilteredDelegates(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDelegates();
    }, []);

    useEffect(() => {
        const filtered = delegates.filter((d) => {
            const matchesSearch =
                d.attendees.some((a) =>
                    a.name.toLowerCase().includes(searchQuery.toLowerCase()),
                ) ||
                d.email_address
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                d.mobile?.includes(searchQuery);

            const matchesStatus =
                statusFilter === "" || d.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
        setFilteredDelegates(filtered);
        setCurrentPage(1);
    }, [searchQuery, statusFilter, delegates]);

    const uniqueStatuses = Array.from(new Set(delegates.map((d) => d.status)));

    const totalPages = Math.ceil(filteredDelegates.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedDelegates = filteredDelegates.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
    );

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <section className="scroll-mt-12. pt-42">
            <div className="container">
                <div className="">
                    <h2 className="mb-9 text-center">
                        Delegates List May 2026
                    </h2>
                    <label className="text-center block text-lg font-medium text-gray-900 dark:text-white mb-10">
                        Below is the list of delegates who have submitted their
                        applications for the May 2026 conference. We are excited
                        to welcome all our delegates and look forward to a
                        successful event! If you have any questions or need
                        further information, please feel free to contact us.
                    </label>
                </div>
                <div className="overflow-x-auto">
                    <div className="mb-4 flex gap-4">
                        <input
                            type="text"
                            placeholder="Search by name, email, or mobile..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Statuses</option>
                            {uniqueStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Email
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Mobile
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Status
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Total
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Arrival
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDelegates.map((delegate) => (
                                <tr
                                    key={delegate.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border border-gray-300 px-4 py-2">
                                        {delegate.email_address}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {delegate.mobile}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                delegate.status,
                                            )}`}
                                        >
                                            {delegate.status}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <details>
                                            <summary className="cursor-pointer font-medium">
                                                {delegate.attendees.length}{" "}
                                                Attendees
                                            </summary>
                                            <div className="mt-2 text-sm text-gray-600">
                                                {delegate.attendees.map(
                                                    (attendee, index) => (
                                                        <div key={index}>
                                                            {attendee.name}{" "}
                                                            (Age: {attendee.age}
                                                            )
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </details>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {delegate.expected_day_of_arrival}
                                        <div>
                                            {delegate.expected_time_of_arrival}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {startIndex + 1} to{" "}
                            {Math.min(
                                startIndex + ITEMS_PER_PAGE,
                                filteredDelegates.length,
                            )}{" "}
                            of {filteredDelegates.length}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 rounded-lg ${
                                            currentPage === page
                                                ? "bg-blue-500 text-white"
                                                : "border border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
