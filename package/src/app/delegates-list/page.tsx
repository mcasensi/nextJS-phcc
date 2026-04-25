"use client";
import { useEffect, useState } from "react";

interface Delegate {
    id: string;
    email_address: string;
    mobile: string;
    pastor_name: string;
    status: string;
    checkout: string;
    web_link: string;
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
    const [loaderCheckout, setLoaderCheckout] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(
        null,
    );
    const [checkoutOption, setCheckoutOption] = useState<string | null>(null);

    const openCheckoutModal = (delegate: Delegate) => {
        setSelectedDelegate(delegate);
        setIsCheckoutModalOpen(true);
    };

    const closeCheckoutModal = () => {
        setIsCheckoutModalOpen(false);
        setSelectedDelegate(null);
        setCheckoutOption(null);
    };

    const handleConfirmCheckout = async () => {
        setLoaderCheckout(true);

        try {
            if (!checkoutOption) {
                throw new Error("Checkout option is required");
            }

            await fetch(
                `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/public-delegates/${selectedDelegate?.web_link}/checkout`,
                {
                    method: "PUT",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({
                        checkout: checkoutOption,
                    }),
                },
            ).catch((err) => {
                setError(
                    "Failed to update checkout status. Please try again later.",
                );
            });
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "An error occurred",
            );
        }

        setTimeout(() => {
            fetchDelegates();
            closeCheckoutModal();
            setLoaderCheckout(false);
        }, 2000);
    };

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
                d.pastor_name
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

    return (
        <section className="scroll-mt-12. pt-42">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <svg
                        className="animate-spin h-8 w-8 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            ) : error ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirm Check Out
                            </h3>
                            <button
                                onClick={() => setError(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">{error}</p>

                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                onClick={() => setError(null)}
                                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="container">
                        <div className="">
                            <h2 className="mb-9 text-center">
                                Delegates List May 2026
                            </h2>
                            <label className="text-center block text-lg font-medium text-gray-900 dark:text-white">
                                Below is the list of delegates who have
                                submitted their applications for the May 2026
                                conference.
                            </label>
                            <label className="text-center block text-lg font-medium text-gray-900 dark:text-white mb-5">
                                Once the status is marked as
                                <span className="inline-block ml-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                                    APPROVED
                                </span>
                                , the check out button will be available for
                                further updates on your application.
                            </label>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="mb-4 flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Search Name"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
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
                            <div className="mb-4 text-sm text-gray-600">
                                Total Delegates: {filteredDelegates.length}
                            </div>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Attendees
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Status
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Details
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
                                                <div className="mt-2 text-sm text-gray-600">
                                                    {delegate.pastor_name && (
                                                        <div className="font-bold">
                                                            Pastor:{" "}
                                                            {
                                                                delegate.pastor_name
                                                            }
                                                        </div>
                                                    )}
                                                    {delegate.attendees.map(
                                                        (attendee, index) => (
                                                            <div key={index}>
                                                                {attendee.name}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
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
                                                <div>
                                                    Arrival:{" "}
                                                    {
                                                        delegate.expected_day_of_arrival
                                                    }{" "}
                                                    (
                                                    {
                                                        delegate.expected_time_of_arrival
                                                    }
                                                    )
                                                </div>
                                                {delegate.checkout &&
                                                delegate.status ==
                                                    "APPROVED" ? (
                                                    <div>
                                                        Departure:{" "}
                                                        {delegate.checkout}
                                                    </div>
                                                ) : (
                                                    <button
                                                        hidden={
                                                            delegate.status !==
                                                                "APPROVED" &&
                                                            delegate.checkout ===
                                                                null
                                                        }
                                                        onClick={() =>
                                                            openCheckoutModal(
                                                                delegate,
                                                            )
                                                        }
                                                        className="bg-red-800 rounded text-white mt-2 p-2"
                                                    >
                                                        Check Out
                                                    </button>
                                                )}
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
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
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
                    {isCheckoutModalOpen && selectedDelegate && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Confirm Check Out
                                    </h3>
                                    <button
                                        onClick={closeCheckoutModal}
                                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                                    >
                                        ×
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Are you sure you want to check out these
                                    delegates?
                                </p>

                                <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm text-gray-700 space-y-3">
                                    <div>
                                        <span className="font-medium">
                                            Pastor:
                                        </span>{" "}
                                        {selectedDelegate.pastor_name}
                                    </div>

                                    <div>
                                        <span className="font-medium">
                                            Attendees:
                                        </span>{" "}
                                        {selectedDelegate.attendees.map(
                                            (attendee, index) => (
                                                <div key={index}>
                                                    {attendee.name} (Age:{" "}
                                                    {attendee.age})
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    <div>
                                        <span className="font-medium">
                                            Mobile:
                                        </span>{" "}
                                        {selectedDelegate.mobile}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Checkout Option{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <div className="space-y-3">
                                        <div className="border border-gray-300 rounded p-3">
                                            <input
                                                type="radio"
                                                id="extension"
                                                name="checkoutOption"
                                                disabled={loaderCheckout}
                                                value="Extension (Check-out on Saturday)"
                                                checked={
                                                    checkoutOption ===
                                                    "Extension (Check-out on Saturday)"
                                                }
                                                onChange={() =>
                                                    setCheckoutOption(
                                                        "Extension (Check-out on Saturday)",
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <label
                                                htmlFor="extension"
                                                className="font-medium cursor-pointer text-sm md:text-base"
                                            >
                                                Extension (Check-out on
                                                Saturday)
                                            </label>
                                            <ul className="ml-6 mt-2 text-xs text-gray-600 list-disc space-y-1">
                                                <li>
                                                    Do not bring bags/luggages
                                                    in the Conference center
                                                </li>
                                                <li>
                                                    Non-sponsored: bring
                                                    payments to Sis. Liza & Sis.
                                                    Merbs
                                                </li>
                                                <li>
                                                    Inform us your room# for
                                                    Budget Hotel coordination
                                                </li>
                                                <li>
                                                    Check-out: Saturday 12noon
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="border border-gray-300 rounded p-3">
                                            <input
                                                type="radio"
                                                id="friday"
                                                name="checkoutOption"
                                                value="Check-out on Friday Noon"
                                                disabled={loaderCheckout}
                                                checked={
                                                    checkoutOption ===
                                                    "Check-out on Friday Noon"
                                                }
                                                onChange={() =>
                                                    setCheckoutOption(
                                                        "Check-out on Friday Noon",
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <label
                                                htmlFor="friday"
                                                className="font-medium cursor-pointer text-sm md:text-base"
                                            >
                                                Check-out on Friday Noon
                                            </label>
                                            <ul className="ml-6 mt-2 text-xs text-gray-600 list-disc space-y-1">
                                                <li>
                                                    Bags/luggages in room
                                                    announced Friday morning
                                                </li>
                                                <li>
                                                    Return to Budget Hotel after
                                                    Friday seminars to check-out
                                                </li>
                                                <li>
                                                    Check-out: Friday noon or
                                                    1pm (latest)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    {!checkoutOption && (
                                        <p className="mt-2 text-sm text-red-600">
                                            Please select a checkout option
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                    <button
                                        onClick={closeCheckoutModal}
                                        disabled={loaderCheckout}
                                        className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmCheckout}
                                        disabled={
                                            !checkoutOption || loaderCheckout
                                        }
                                        className="rounded bg-red-800 px-4 py-2 text-sm text-white hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                                    >
                                        Confirm Check Out
                                        {loaderCheckout && (
                                            <span className="ml-2 inline-block">
                                                <svg
                                                    className="animate-spin h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
