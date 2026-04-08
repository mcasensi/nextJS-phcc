"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

type Attendee = {
    id: string;
    name: string;
    age: string;
};

export default function Directory() {
    const formik = useFormik({
        initialValues: {
            pastor_name: "",
            church_address: "",
            mobile: "",
            email_address: "",
            comments: "",
            expected_day_of_arrival: "",
            expected_date_of_arrival: "",
            expected_time_of_arrival: "",
            sponsored: false,
            non_sponsored: false,
        },
        validationSchema: Yup.object().shape({
            pastor_name: Yup.string().required("Pastor name is required"),
            church_address: Yup.string(),
            mobile: Yup.string().required("Mobile number is required"),
            email_address: Yup.string().email("Invalid email"),
            comments: Yup.string(),
            expected_day_of_arrival: Yup.string().required("Day is required"),
            expected_date_of_arrival: Yup.string().required("Date is required"),
            expected_time_of_arrival: Yup.string().required("Time is required"),
            non_sponsored: Yup.boolean().required(
                "Sponsorship status is required",
            ),
        }),
        onSubmit: async (values) => {
            setLoader(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/public-delegates/`,
                    {
                        method: "POST",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify({
                            ...values,
                            attendees: attendees,
                        }),
                    },
                );
                const data = await response.json();
                if (data.web_link) {
                    setTimeout(() => {
                        setShowThanks(true);
                        formik.resetForm();
                        setAttendees([]);
                        setSuccessData(data);
                        setLoader(false);
                    }, 3000);
                }
            } catch (error) {
                console.error(error);
                setLoader(false);
            }
        },
    });
    const [loader, setLoader] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showThanks, setShowThanks] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);

    const [attendees, setAttendees] = useState<Attendee[]>([
        {
            id: crypto.randomUUID(),
            name: "",
            age: "",
        },
    ]);
    const [showAttendeesForm, setShowAttendeesForm] = useState(true);

    useEffect(() => {
        const isValid = Object.values(formik.values).every((value) =>
            typeof value === "string" ? value.trim() !== "" : true,
        );
        setIsFormValid(isValid);
    }, [formik.values]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        formik.setFieldValue(name, value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await formik.submitForm();
    };

    const addAttendeesForm = () => {
        setShowAttendeesForm(true);
        setAttendees((prev) => [
            ...prev,
            { id: crypto.randomUUID(), name: "", age: "" },
        ]);
    };

    const removeAttendees = (id: string) => {
        setAttendees((prev) => {
            const next = prev.filter((attendee) => attendee.id !== id);
            if (next.length === 0) setShowAttendeesForm(false);
            return next;
        });
    };

    const getErrorClass = (fieldName: string) => {
        return formik.touched[fieldName as keyof typeof formik.touched] &&
            formik.errors[fieldName as keyof typeof formik.errors]
            ? "border-red-500"
            : "";
    };

    return (
        <section id="contact" className="scroll-mt-12. pt-42">
            <div className="container">
                <div className="">
                    <h2 className="mb-9 text-center">
                        Delegates Registration May 2026
                    </h2>
                    <label
                        hidden={showThanks}
                        className="text-center block text-lg font-medium text-gray-900 dark:text-white mb-10"
                    >
                        Please fill out the form below to register as a delegate
                        for the upcoming event. We look forward to welcoming you
                        for this coming conference. You can also view all the
                        list of delegates{" "}
                        <div className="mt-1 flex items-center justify-center gap-2">
                            <label className="font-bold text-primary hover:underline">
                                <a
                                    href={`${process.env.NEXT_PUBLIC_WEB_API_URL}/delegates-list`}
                                    className="font-bold hover:underline"
                                >
                                    {`${process.env.NEXT_PUBLIC_WEB_API_URL}/delegates-list`}
                                </a>
                            </label>
                        </div>
                    </label>
                    <div
                        className="relative border px-6 py-2 rounded-lg border-black/20 dark:border-white/20"
                        hidden={successData}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap w-full m-auto justify-between"
                        >
                            <div className="container justify-center">
                                <h3 className="text-stone-900 mb-8 mt-4">
                                    Attendees
                                </h3>
                                {showAttendeesForm && (
                                    <div className="row w-full justify-center">
                                        {attendees.map((attendee) => (
                                            <div
                                                className="border border-black/20 dark:border-white/20 w-full m-auto justify-between items-center gap-4 mb-7 rounded-lg px-6 py-2"
                                                key={attendee.id}
                                            >
                                                <div className="flex items-center gap-4 w-full">
                                                    <label className="text-base font-medium flex-1">
                                                        Attendee{" "}
                                                        {attendees.indexOf(
                                                            attendee,
                                                        ) + 1}
                                                    </label>
                                                    <button
                                                        type="button"
                                                        hidden={
                                                            attendees.length ===
                                                            1
                                                        }
                                                        className="p-2 text-red-600 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                        disabled={loader}
                                                        onClick={() =>
                                                            removeAttendees(
                                                                attendee.id,
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            className="w-6 h-6"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="w-full">
                                                    <div className="sm:flex gap-6 w-full">
                                                        <div className="mx-0 my-2.5 flex-1">
                                                            <label
                                                                htmlFor="lname"
                                                                className="pb-3 inline-block text-base"
                                                            >
                                                                Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                disabled={
                                                                    loader
                                                                }
                                                                value={
                                                                    attendee.name
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const {
                                                                        name,
                                                                        value,
                                                                    } =
                                                                        e.target;
                                                                    setAttendees(
                                                                        (
                                                                            prev,
                                                                        ) =>
                                                                            prev.map(
                                                                                (
                                                                                    a,
                                                                                ) =>
                                                                                    a.id ===
                                                                                    attendee.id
                                                                                        ? {
                                                                                              ...a,
                                                                                              [name]: value,
                                                                                          }
                                                                                        : a,
                                                                            ),
                                                                    );
                                                                }}
                                                                className={`w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 ${loader ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                                                            />
                                                        </div>
                                                        <div className="mx-0 my-2.5 flex-1">
                                                            <label
                                                                htmlFor="lname"
                                                                className="pb-3 inline-block text-base"
                                                            >
                                                                Age
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="age"
                                                                disabled={
                                                                    loader
                                                                }
                                                                value={
                                                                    attendee.age
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const {
                                                                        name,
                                                                        value,
                                                                    } =
                                                                        e.target;
                                                                    setAttendees(
                                                                        (
                                                                            prev,
                                                                        ) =>
                                                                            prev.map(
                                                                                (
                                                                                    a,
                                                                                ) =>
                                                                                    a.id ===
                                                                                    attendee.id
                                                                                        ? {
                                                                                              ...a,
                                                                                              [name]: value,
                                                                                          }
                                                                                        : a,
                                                                            ),
                                                                    );
                                                                }}
                                                                className={`w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 ${loader ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="container justify-center mt-5 mb-8">
                                <div className="flex gap-6 w-full flex-wrap justify-center">
                                    <div className="justify-center flex">
                                        <button
                                            type="button"
                                            className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                            onClick={addAttendeesForm}
                                            disabled={loader}
                                        >
                                            Add Attendees
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <hr className="w-full border-gray-300 my-6" />
                            <h3 className="text-stone-900 mb-4 mt-4">
                                Other Details
                            </h3>
                            <div className="sm:flex gap-6 w-full">
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Church Address{" "}
                                        <span className="text-sm text-gray-500">
                                            (Street, City, State, ZIP)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="church_address"
                                        value={formik.values.church_address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={loader}
                                        className={`w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 ${getErrorClass("church_address")} ${loader ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                                    />
                                    {formik.touched.church_address &&
                                        formik.errors.church_address && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.church_address}
                                            </p>
                                        )}
                                </div>
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Pastor's Full Name{" "}
                                        <span className="text-sm text-gray-500">
                                            (First Name Last Name)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="pastor_name"
                                        value={formik.values.pastor_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={loader}
                                        className={`w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 ${getErrorClass("pastor_name")} ${loader ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                                    />
                                    {formik.touched.pastor_name &&
                                        formik.errors.pastor_name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.pastor_name}
                                            </p>
                                        )}
                                </div>
                            </div>
                            <div className="sm:flex gap-6 w-full">
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="text"
                                        name="email_address"
                                        value={formik.values.email_address}
                                        onChange={formik.handleChange}
                                        disabled={loader}
                                        onBlur={formik.handleBlur}
                                        className={`w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 ${getErrorClass("email_address")} ${loader ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                                    />
                                    {formik.touched.email_address &&
                                        formik.errors.email_address && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.email_address}
                                            </p>
                                        )}
                                </div>
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="+639XXXXX"
                                        name="mobile"
                                        disabled={loader}
                                        value={formik.values.mobile}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 ${getErrorClass("mobile")} ${loader ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                                    />
                                    {formik.touched.mobile &&
                                        formik.errors.mobile && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.mobile}
                                            </p>
                                        )}
                                </div>
                            </div>
                            <div className="sm:flex gap-6 w-full">
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Expected Date of Arrival:
                                    </label>
                                    <select
                                        name="expected_date_of_arrival"
                                        disabled={loader}
                                        value={
                                            formik.values
                                                .expected_date_of_arrival
                                        }
                                        onChange={(e) => {
                                            handleChange(e);
                                            if (
                                                e.target.value === "04/04/2026"
                                            ) {
                                                formik.setFieldValue(
                                                    "expected_day_of_arrival",
                                                    "Monday",
                                                );
                                            } else if (
                                                e.target.value === "05/05/2026"
                                            ) {
                                                formik.setFieldValue(
                                                    "expected_day_of_arrival",
                                                    "Tuesday",
                                                );
                                            } else {
                                                formik.setFieldValue(
                                                    "expected_day_of_arrival",
                                                    "",
                                                );
                                            }
                                        }}
                                        onBlur={formik.handleBlur}
                                        className={`w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 ${getErrorClass("expected_date_of_arrival")} ${loader ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                                    >
                                        <option value="">Select a Date</option>
                                        <option value="04/04/2026">
                                            May 4, 2026
                                        </option>
                                        <option value="05/05/2026">
                                            May 5, 2026
                                        </option>
                                    </select>
                                    {formik.touched.expected_date_of_arrival &&
                                        formik.errors
                                            .expected_date_of_arrival && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {
                                                    formik.errors
                                                        .expected_date_of_arrival
                                                }
                                            </p>
                                        )}
                                </div>
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Expected Day:
                                    </label>
                                    <select
                                        disabled
                                        name="expected_day_of_arrival"
                                        value={
                                            formik.values
                                                .expected_day_of_arrival
                                        }
                                        onChange={formik.handleChange}
                                        className={`w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 cursor-not-allowed ${loader ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                                    >
                                        <option value="">Select a date</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                    </select>
                                    {formik.touched.expected_day_of_arrival &&
                                        formik.errors
                                            .expected_day_of_arrival && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {
                                                    formik.errors
                                                        .expected_day_of_arrival
                                                }
                                            </p>
                                        )}
                                </div>
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Expected Time of Arrival:
                                    </label>
                                    <input
                                        type="time"
                                        name="expected_time_of_arrival"
                                        value={
                                            formik.values
                                                .expected_time_of_arrival
                                        }
                                        disabled={loader}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 ${getErrorClass("expected_time_of_arrival")} ${loader ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                                    />
                                    {formik.touched.expected_time_of_arrival &&
                                        formik.errors
                                            .expected_time_of_arrival && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {
                                                    formik.errors
                                                        .expected_time_of_arrival
                                                }
                                            </p>
                                        )}
                                </div>
                            </div>
                            <div className="sm:flex gap-6 w-full">
                                <div className="mx-0 my-2.5 flex-1">
                                    <div className="flex items-center gap-4">
                                        <label className="text-base">
                                            Are you sponsored?
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 disabled:cursor-not-allowed disabled:text-gray-500">
                                                <input
                                                    type="radio"
                                                    name="sponsored"
                                                    value="true"
                                                    disabled={loader}
                                                    checked={
                                                        formik.values
                                                            .sponsored === true
                                                    }
                                                    onChange={() =>
                                                        formik.setFieldValue(
                                                            "sponsored",
                                                            true,
                                                        )
                                                    }
                                                    onBlur={formik.handleBlur}
                                                />
                                                Yes
                                            </label>
                                            <label className="flex items-center gap-2 disabled:cursor-not-allowed disabled:text-gray-500">
                                                <input
                                                    type="radio"
                                                    name="sponsored"
                                                    value="false"
                                                    disabled={loader}
                                                    checked={
                                                        formik.values
                                                            .sponsored === false
                                                    }
                                                    onChange={() =>
                                                        formik.setFieldValue(
                                                            "sponsored",
                                                            false,
                                                        )
                                                    }
                                                    onBlur={formik.handleBlur}
                                                />
                                                No
                                            </label>
                                        </div>
                                        {formik.touched.sponsored &&
                                            formik.errors.sponsored && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {formik.errors.sponsored}
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="sm:flex gap-6 w-full"
                                hidden={formik.values.sponsored === true}
                            >
                                <div className="mx-0 my-2.5 flex-1">
                                    <div className="flex items-center gap-4">
                                        <label className="text-base">
                                            Non-Sponsored
                                            <span className="text-sm text-gray-500">
                                                (For Non-sponsored but with
                                                request assistance for hotel
                                                booking (P500 per head per
                                                night), tick Yes)
                                            </span>
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 disabled:cursor-not-allowed disabled:text-gray-500">
                                                <input
                                                    type="radio"
                                                    name="non_sponsored"
                                                    value="true"
                                                    disabled={loader}
                                                    checked={
                                                        formik.values
                                                            .non_sponsored ===
                                                        true
                                                    }
                                                    onChange={() =>
                                                        formik.setFieldValue(
                                                            "non_sponsored",
                                                            true,
                                                        )
                                                    }
                                                    onBlur={formik.handleBlur}
                                                />
                                                Yes
                                            </label>
                                            <label className="flex items-center gap-2 disabled:cursor-not-allowed disabled:text-gray-500">
                                                <input
                                                    type="radio"
                                                    name="non_sponsored"
                                                    value="false"
                                                    disabled={loader}
                                                    checked={
                                                        formik.values
                                                            .non_sponsored ===
                                                        false
                                                    }
                                                    onChange={() =>
                                                        formik.setFieldValue(
                                                            "non_sponsored",
                                                            false,
                                                        )
                                                    }
                                                    onBlur={formik.handleBlur}
                                                />
                                                No
                                            </label>
                                        </div>
                                        {formik.touched.non_sponsored &&
                                            formik.errors.non_sponsored && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {
                                                        formik.errors
                                                            .non_sponsored
                                                    }
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                            <div className="sm:flex gap-6 w-full">
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Comments/Notes:
                                    </label>
                                    <textarea
                                        name="comments"
                                        value={formik.values.comments}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={loader}
                                        className={`w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 ${loader ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <div className="mx-0 my-2.5 w-full">
                                <button
                                    type="submit"
                                    disabled={loader}
                                    className={`w-full text-base px-4 rounded-lg py-3 border-solid border transition-all duration-500 focus:outline-0 ${
                                        !loader
                                            ? "bg-primary hover:bg-primary/90 text-white border-primary"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                                    }`}
                                >
                                    Submit Application
                                    {loader && (
                                        <span className="inline-block ml-2">
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
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
                        </form>
                    </div>
                    {showThanks && (
                        <div className="text-white px-4 text-lg mb-2 mt-1 grid-cols-1 items-center">
                            <label className="text-center block text-lg font-medium text-gray-900 dark:text-white mb-3">
                                Thank you for submitting your application! We
                                will review your application and get back to you
                                as soon as possible. You can also view your
                                application on this link below:
                            </label>
                            <div className="mt-1 flex items-center justify-center gap-2">
                                <label className="font-bold text-primary hover:underline">
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_WEB_API_URL}/delegates-list`}
                                        className="font-bold hover:underline"
                                    >
                                        {`${process.env.NEXT_PUBLIC_WEB_API_URL}/delegates-list`}
                                    </a>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
