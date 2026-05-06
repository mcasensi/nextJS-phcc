"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Row = Record<string, unknown>;

type EditState = {
    checkOut: string;
    roomNumber: string;
    saving: boolean;
    message?: string;
};

type ActiveModal = {
    key: string;
    row: Row;
    idx: number;
} | null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const TABLE_NAME = "attendees";

type CheckoutOption = {
    label: string;
    reminderTitle?: string;
    reminderItems: string[];
};

const CHECKOUT_OPTIONS: CheckoutOption[] = [
    {
        label: "For extension (check-out on Saturday)",
        reminderTitle: "REMINDERS:",
        reminderItems: [
            "Please do not bring your bags/luggages in the Conference center.",
            "For non-sponsored, remember to bring your payments to our staff, sis. Liza Yema & sis. Merbz.",
            "Your check-out will be Saturday 12noon.",
        ],
    },
    {
        label: "Check-out on Friday noon",
        reminderTitle: "REMINDERS:",
        reminderItems: [
            "You may put your bags/luggages in the room that will be announced on Friday morning.",
            "Please go back to your unit in Budget Hotel after Friday morning seminars to check-out.",
            "Your check-out will be Friday noon or 1pm (latest).",
        ],
    },
];

const MATCHER_CANDIDATES = [
    "id",
    "attendee_id",
    "delegate_id",
    "registration_id",
    "email",
    "uuid",
    "reference_no",
    "ref_no",
];

const findExistingKey = (headers: string[], candidates: string[]) => {
    const lower = new Map(headers.map((h) => [h.toLowerCase(), h]));
    for (const c of candidates) {
        const found = lower.get(c.toLowerCase());
        if (found) return found;
    }
    return null;
};

const getValueByCandidates = (
    row: Row,
    candidates: string[],
): { column: string; value: string | number } | null => {
    const entries = Object.entries(row);
    const keyMap = new Map(entries.map(([k]) => [k.toLowerCase(), k]));

    for (const candidate of candidates) {
        const actualKey = keyMap.get(candidate.toLowerCase());
        if (!actualKey) continue;

        const value = row[actualKey];
        if (typeof value === "string" || typeof value === "number") {
            if (String(value).trim() !== "") {
                return { column: actualKey, value };
            }
        }
    }

    return null;
};

const getMatcher = (
    row: Row,
): { column: string; value: string | number } | null => {
    // 1) explicit candidates first
    const byCandidates = getValueByCandidates(row, MATCHER_CANDIDATES);
    if (byCandidates) return byCandidates;

    // 2) fallback: auto-detect likely unique key columns
    const entries = Object.entries(row);
    for (const [col, val] of entries) {
        if (typeof val !== "string" && typeof val !== "number") continue;
        if (String(val).trim() === "") continue;

        const c = col.toLowerCase();
        const looksLikeKey =
            c === "id" ||
            c.endsWith("_id") ||
            c.includes("email") ||
            c.includes("uuid") ||
            c.includes("reference") ||
            c.includes("ref") ||
            c.includes("code");

        if (looksLikeKey) return { column: col, value: val };
    }

    return null;
};

const getRowKey = (row: Row, idx: number) => {
    const m = getMatcher(row);
    return m ? `${m.column}:${m.value}` : `row:${idx}`;
};

export default function Page1() {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [edits, setEdits] = useState<Record<string, EditState>>({});
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);

    const supabase = useMemo(
        () => createClient(supabaseUrl, supabaseAnonKey),
        [],
    );

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select("*")
                .limit(200);

            if (error) {
                setError(error.message);
                setRows([]);
            } else {
                setRows(data ?? []);
            }

            setLoading(false);
        };

        load();
    }, [supabase]);

    const headers = rows.length ? Object.keys(rows[0]) : [];

    const visibleHeaders = useMemo(
        () => headers.filter((h) => h.toLowerCase() !== "id"),
        [headers],
    );

    const checkoutColumn = useMemo(
        () =>
            findExistingKey(headers, ["check_out", "check out", "checkout"]) ??
            "check_out",
        [headers],
    );

    const roomColumn = useMemo(
        () =>
            findExistingKey(headers, [
                "room_number",
                "room number",
                "room_no",
                "room no",
            ]) ?? "room_number",
        [headers],
    );

    const churchCityColumn = useMemo(
        () =>
            findExistingKey(headers, [
                "church_city",
                "church city",
                "churchcity",
                "city",
            ]),
        [headers],
    );

    useEffect(() => {
        setEdits((prev) => {
            const next = { ...prev };
            rows.forEach((row, idx) => {
                const key = getRowKey(row, idx);
                if (!next[key]) {
                    next[key] = {
                        checkOut: String(row[checkoutColumn] ?? ""),
                        roomNumber: String(row[roomColumn] ?? ""),
                        saving: false,
                    };
                }
            });
            return next;
        });
    }, [rows, checkoutColumn, roomColumn]);

    const filteredRows = useMemo(() => {
        if (!search.trim()) return rows;
        const q = search.toLowerCase();
        return rows.filter((row) =>
            Object.values(row).some((val) =>
                String(val ?? "")
                    .toLowerCase()
                    .includes(q),
            ),
        );
    }, [rows, search]);

    const saveRow = async (row: Row, idx: number): Promise<boolean> => {
        const key = getRowKey(row, idx);
        const draft = edits[key];
        if (!draft) return false;

        const churchCityValue = churchCityColumn
            ? row[churchCityColumn]
            : undefined;

        const canBulkUpdate =
            churchCityColumn &&
            (typeof churchCityValue === "string" ||
                typeof churchCityValue === "number") &&
            String(churchCityValue).trim() !== "";

        setEdits((prev) => ({
            ...prev,
            [key]: { ...prev[key], saving: true, message: undefined },
        }));

        let updateQuery = supabase.from(TABLE_NAME).update({
            [checkoutColumn]: draft.checkOut,
            [roomColumn]: draft.roomNumber,
        });

        if (canBulkUpdate) {
            updateQuery = updateQuery.eq(churchCityColumn, churchCityValue);
        } else {
            const matcher = getMatcher(row);
            if (!matcher) {
                setEdits((prev) => ({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        saving: false,
                        message:
                            "Cannot update this row (no usable Church City or unique key).",
                    },
                }));
                return false;
            }

            updateQuery = updateQuery.eq(matcher.column, matcher.value);
        }

        const { error: updateError } = await updateQuery.select("*");

        if (updateError) {
            setEdits((prev) => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    saving: false,
                    message: `Update failed: ${updateError.message}`,
                },
            }));
            return false;
        }

        setRows((prev) =>
            prev.map((r) => {
                const sameChurchCity =
                    canBulkUpdate &&
                    churchCityColumn &&
                    String(r[churchCityColumn] ?? "") ===
                        String(churchCityValue ?? "");

                const sameRow = getRowKey(r, rows.indexOf(r)) === key;

                if (sameChurchCity || (!canBulkUpdate && sameRow)) {
                    return {
                        ...r,
                        [checkoutColumn]: draft.checkOut,
                        [roomColumn]: draft.roomNumber,
                    };
                }

                return r;
            }),
        );

        setEdits((prev) => {
            const next = { ...prev };

            if (canBulkUpdate && churchCityColumn) {
                rows.forEach((r, rowIdx) => {
                    if (
                        String(r[churchCityColumn] ?? "") ===
                        String(churchCityValue ?? "")
                    ) {
                        const rowKey = getRowKey(r, rowIdx);
                        next[rowKey] = {
                            ...next[rowKey],
                            checkOut: draft.checkOut,
                            roomNumber: draft.roomNumber,
                            saving: false,
                            message: `Updated all rows for ${churchCityValue}.`,
                        };
                    }
                });
            } else {
                next[key] = {
                    ...next[key],
                    saving: false,
                    message: "Updated.",
                };
            }

            return next;
        });

        return true;
    };

    const modalDraft = activeModal ? edits[activeModal.key] : undefined;
    const modalSelected = modalDraft
        ? CHECKOUT_OPTIONS.find((o) => o.label === modalDraft.checkOut)
        : undefined;

    return (
        <section className="scroll-mt-12 pt-42">
            <div className="container">
                <h2 className="mb-9 text-center">Delegates List May 2026</h2>
                <label className="text-center block text-lg font-medium text-gray-900 dark:text-white">
                    Below is the list of delegates who have submitted their
                    applications for the May 2026 conference.
                </label>
                <label className="text-center block text-lg font-medium text-gray-900 dark:text-white mb-5">
                    Update the application by Checking out.
                </label>
            </div>
            <div className="container">
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search delegates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                    <p>No rows found.</p>
                )}

                {!loading && !error && filteredRows.length > 0 && (
                    <div className="overflow-auto rounded border">
                        <table className="min-w-full border-collapse text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    {visibleHeaders.map((h) => (
                                        <th
                                            key={h}
                                            className="border px-3 py-2 text-left font-medium"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                    <th className="border px-3 py-2 text-left font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row, idx) => {
                                    const key = getRowKey(row, idx);
                                    const draft = edits[key] ?? {
                                        checkOut: "",
                                        roomNumber: "",
                                        saving: false,
                                    };

                                    return (
                                        <tr
                                            key={key}
                                            className="odd:bg-white even:bg-gray-50"
                                        >
                                            {visibleHeaders.map((h) => (
                                                <td
                                                    key={h}
                                                    className="border px-3 py-2 align-top"
                                                >
                                                    {String(row[h] ?? "")}
                                                </td>
                                            ))}

                                            <td className="border px-3 py-2 align-top min-w-40">
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEdits(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [key]: prev[
                                                                        key
                                                                    ] ?? {
                                                                        checkOut:
                                                                            String(
                                                                                row[
                                                                                    checkoutColumn
                                                                                ] ??
                                                                                    "",
                                                                            ),
                                                                        roomNumber:
                                                                            String(
                                                                                row[
                                                                                    roomColumn
                                                                                ] ??
                                                                                    "",
                                                                            ),
                                                                        saving: false,
                                                                    },
                                                                }),
                                                            );
                                                            setActiveModal({
                                                                key,
                                                                row,
                                                                idx,
                                                            });
                                                        }}
                                                        className="w-fit rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
                                                    >
                                                        Update
                                                    </button>
                                                    {draft.message && (
                                                        <p className="text-xs text-gray-600">
                                                            {draft.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {activeModal && modalDraft && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div
                        className="w-full max-w-2xl rounded-lg bg-white p-5 shadow-xl"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Update check-out"
                    >
                        <h3 className="mb-4 text-lg font-semibold">
                            Update Check Out
                        </h3>

                        <div className="mb-3">
                            <label className="mb-1 block text-sm font-medium">
                                Room Number
                            </label>
                            <input
                                type="text"
                                placeholder="Room #"
                                value={modalDraft.roomNumber}
                                onChange={(e) =>
                                    setEdits((prev) => ({
                                        ...prev,
                                        [activeModal.key]: {
                                            ...modalDraft,
                                            roomNumber: e.target.value,
                                        },
                                    }))
                                }
                                className="w-full rounded border border-gray-300 px-3 py-2"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-1 block text-sm font-medium">
                                Check Out Option
                            </label>
                            <select
                                value={modalDraft.checkOut}
                                onChange={(e) =>
                                    setEdits((prev) => ({
                                        ...prev,
                                        [activeModal.key]: {
                                            ...modalDraft,
                                            checkOut: e.target.value,
                                        },
                                    }))
                                }
                                className="w-full rounded border border-gray-300 px-3 py-2"
                            >
                                <option value="">
                                    Select check-out option
                                </option>

                                {CHECKOUT_OPTIONS.map((opt) => (
                                    <option key={opt.label} value={opt.label}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {modalSelected && (
                            <div className="mb-3 rounded border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
                                {modalSelected.reminderTitle && (
                                    <p className="mb-2 font-semibold">
                                        {modalSelected.reminderTitle}
                                    </p>
                                )}
                                <ol className="list-[lower-alpha] pl-4 space-y-1">
                                    {modalSelected.reminderItems.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {modalDraft.message && (
                            <p className="mb-3 text-xs text-gray-600">
                                {modalDraft.message}
                            </p>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setActiveModal(null)}
                                className="rounded border px-3 py-1.5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    const current = activeModal;
                                    const ok = await saveRow(
                                        current.row,
                                        current.idx,
                                    );
                                    if (ok) setActiveModal(null);
                                }}
                                disabled={modalDraft.saving}
                                className="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {modalDraft.saving ? "Saving..." : "Check Out"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
