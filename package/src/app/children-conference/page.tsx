"use client";

import { FormEvent, useState } from "react";

type MinistryYears =
    | "Less than 6 months"
    | "6 months - 1 year"
    | "1 year - 2 years"
    | "More than 2 years to less than 5 years"
    | "More than 5 years to less than 10 years"
    | "More than 10 years";

type SelfBookingOption =
    | "Yes"
    | "N/A (within Metro Manila or nearby)"
    | "Request assistance";

type Participant = {
    name: string;
    age: string;
    yearsInMinistry: MinistryYears | "";
};

const MINISTRY_OPTIONS: MinistryYears[] = [
    "Less than 6 months",
    "6 months - 1 year",
    "1 year - 2 years",
    "More than 2 years to less than 5 years",
    "More than 5 years to less than 10 years",
    "More than 10 years",
];

const inputClassName =
    "w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200";

const sectionClassName =
    "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6";

const radioOptionClassName =
    "flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white";

export default function ChildrenConferencePage() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [churchCity, setChurchCity] = useState("");
    const [pastorName, setPastorName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [selfBooking, setSelfBooking] = useState<SelfBookingOption | "">("");
    const [expectations, setExpectations] = useState("");

    const [participants, setParticipants] = useState<Participant[]>([
        { name: "", age: "", yearsInMinistry: "" },
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">(
        "",
    );

    const addParticipant = () => {
        setParticipants((prev) => [
            ...prev,
            { name: "", age: "", yearsInMinistry: "" },
        ]);
    };

    const removeParticipant = (index: number) => {
        setParticipants((prev) => prev.filter((_, i) => i !== index));
    };

    const updateParticipant = (
        index: number,
        field: keyof Participant,
        value: string,
    ) => {
        setParticipants((prev) =>
            prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
        );
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");

        const hasInvalidParticipant = participants.some(
            (p) => !p.name.trim() || !p.age.trim() || !p.yearsInMinistry,
        );

        if (hasInvalidParticipant) {
            setMessage("Please complete all participant fields.");
            setMessageType("error");
            return;
        }

        const payload = {
            timestamp: new Date().toISOString(),
            registrant: {
                name,
                age,
                churchCity,
                pastorName,
                contactNumber,
            },
            selfBooking,
            expectations,
            participants,
        };

        try {
            setIsSubmitting(true);

            const res = await fetch("/api/children-conference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Submission failed");
            }

            setMessage("Submitted successfully.");
            setMessageType("success");
            setName("");
            setAge("");
            setChurchCity("");
            setPastorName("");
            setContactNumber("");
            setSelfBooking("");
            setExpectations("");
            setParticipants([{ name: "", age: "", yearsInMinistry: "" }]);
        } catch {
            setMessage("Could not submit form. Please try again.");
            setMessageType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <section className="mb-6 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="mb-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                                Conference Registration
                            </p>
                            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                                Children&apos;s Conference Registration
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                                Register your details and participant
                                information for the upcoming children&apos;s
                                conference.
                            </p>
                        </div>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <section className={sectionClassName}>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Registrant Details
                            </h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Name
                                </label>
                                <input
                                    className={inputClassName}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    className={inputClassName}
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Church City
                                </label>
                                <input
                                    className={inputClassName}
                                    value={churchCity}
                                    onChange={(e) =>
                                        setChurchCity(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Pastor&apos;s Name
                                </label>
                                <input
                                    className={inputClassName}
                                    value={pastorName}
                                    onChange={(e) =>
                                        setPastorName(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Contact#
                                </label>
                                <input
                                    type="tel"
                                    className={inputClassName}
                                    value={contactNumber}
                                    onChange={(e) =>
                                        setContactNumber(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className={sectionClassName}>
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Self-booking
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Booking of hotel reservations is your
                                responsibility. Please ensure separate rooms of
                                males and females unless married.
                            </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            {(
                                [
                                    "Yes",
                                    "N/A (within Metro Manila or nearby)",
                                    "Request assistance",
                                ] as SelfBookingOption[]
                            ).map((option) => (
                                <label
                                    key={option}
                                    className={`${radioOptionClassName} cursor-pointer`}
                                >
                                    <input
                                        type="radio"
                                        name="selfBooking"
                                        checked={selfBooking === option}
                                        onChange={() => setSelfBooking(option)}
                                        required
                                        className="mt-0.5 h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-400"
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className={sectionClassName}>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Expectations from the conference (optional)
                        </label>
                        <textarea
                            className={`${inputClassName} min-h-[120px] resize-y`}
                            rows={4}
                            value={expectations}
                            onChange={(e) => setExpectations(e.target.value)}
                        />
                    </section>

                    <section className={sectionClassName}>
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Participants
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    Add all participants attending the
                                    conference.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addParticipant}
                                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                            >
                                + Add participant
                            </button>
                        </div>

                        <div className="space-y-4">
                            {participants.map((participant, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm sm:p-5"
                                >
                                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="font-medium text-slate-900">
                                            Participant {index + 1}
                                        </p>
                                        {participants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeParticipant(index)
                                                }
                                                className="text-sm font-medium text-red-600 transition hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-sm text-slate-700">
                                                Name
                                            </label>
                                            <input
                                                className={inputClassName}
                                                value={participant.name}
                                                onChange={(e) =>
                                                    updateParticipant(
                                                        index,
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm text-slate-700">
                                                Age
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                className={inputClassName}
                                                value={participant.age}
                                                onChange={(e) =>
                                                    updateParticipant(
                                                        index,
                                                        "age",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <p className="mb-2 text-sm font-medium text-slate-700">
                                            Years in children&apos;s ministry
                                        </p>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {MINISTRY_OPTIONS.map((option) => (
                                                <label
                                                    key={option}
                                                    className={`${radioOptionClassName} cursor-pointer`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`yearsInMinistry-${index}`}
                                                        checked={
                                                            participant.yearsInMinistry ===
                                                            option
                                                        }
                                                        onChange={() =>
                                                            updateParticipant(
                                                                index,
                                                                "yearsInMinistry",
                                                                option,
                                                            )
                                                        }
                                                        required
                                                        className="mt-0.5 h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-400"
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit Registration"}
                        </button>

                        {message && (
                            <p
                                className={`text-sm font-medium ${
                                    messageType === "success"
                                        ? "text-emerald-600"
                                        : "text-red-600"
                                }`}
                            >
                                {message}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
}
