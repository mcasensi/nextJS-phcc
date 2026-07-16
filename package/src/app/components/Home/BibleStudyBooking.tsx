"use client";
import { useState } from "react";
import Image from "next/image";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];
const TIMES = [
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
];

export default function BibleStudyBooking() {
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        address: "",
        day: "",
        time: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const res = await fetch("/api/bible-study", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || "Failed to submit");
            }

            setSubmitted(true);
        } catch (error) {
            console.error("Submission error:", error);
            setErrorMsg("Failed to submit. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative bg-blue-950 py-16 px-4 mt-10 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/category/bible-study.avif"
                    alt="Bible Study Group Background"
                    fill
                    className="object-cover opacity-5"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-xl mx-auto">
                <div className="text-center mb-10">
                    <span className="inline-block bg-blue-700/60 text-blue-200 text-xs font-semibold px-4 py-1 rounded-full mb-3 tracking-widest uppercase">
                        Free Home Visit
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Book a Bible Study
                    </h2>
                    <p className="text-blue-300 text-sm">
                        Sign up for a free home Bible study group. We'll come to
                        you!
                    </p>
                    <p className="text-blue-200/60 italic text-xs mt-3">
                        "For where two or three gather in my name, there am I
                        with them." — Matthew 18:20
                    </p>
                </div>

                {submitted ? (
                    <div className="bg-green-700/90 backdrop-blur-sm text-white text-center rounded-xl p-8 shadow-lg">
                        <div className="text-5xl mb-4">🙏</div>
                        <h3 className="text-2xl font-bold mb-2">
                            Thank You, {form.name}!
                        </h3>
                        <p className="text-green-200">
                            Your Bible study booking has been received. We'll
                            contact you at <strong>{form.mobile}</strong> to
                            confirm your schedule on <strong>{form.day}</strong>{" "}
                            at <strong>{form.time}</strong>.
                        </p>
                        <button
                            className="mt-6 bg-white text-green-700 font-bold py-2 px-6 rounded-full hover:bg-green-100 transition"
                            onClick={() => {
                                setSubmitted(false);
                                setForm({
                                    name: "",
                                    mobile: "",
                                    address: "",
                                    day: "",
                                    time: "",
                                });
                            }}
                        >
                            Book Another
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 flex flex-col gap-5"
                    >
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Full Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Juan dela Cruz"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Mobile Number{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                required
                                placeholder="09xx xxx xxxx"
                                pattern="[0-9]{10,11}"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                required
                                placeholder="House No., Street, Barangay, City"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Day & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Day <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="day"
                                    value={form.day}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Day</option>
                                    {DAYS.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Time <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="time"
                                    value={form.time}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Time</option>
                                    {TIMES.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {errorMsg ? (
                            <p className="text-sm text-red-600">{errorMsg}</p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition text-sm tracking-wide"
                        >
                            {loading ? "Submitting..." : "Book Bible Study"}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
