"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { WEB_API_URL, API_URL } from "@/lib/config";
import PastorForm from "./pastorForm";

export default function Directory() {
    const [photoData, setPhotoData] = useState<{ photo: File | null }>({
        photo: null,
    });
    const [showThanks, setShowThanks] = useState(false);
    const [loader, setLoader] = useState(false);
    const [applicationEnabled, _] = useState(false);
    const [churchLink, setChurchLink] = useState("");

    async function handleSubmit(values: any) {
        setLoader(true);

        const payload = JSON.stringify({
            ...values,
        });

        const newFormData = new FormData();
        newFormData.append("directory", payload);

        if (photoData.photo) {
            newFormData.append("photo", photoData.photo as Blob);
        }

        try {
            const response = await fetch(`${API_URL}/directory/`, {
                method: "POST",
                body: newFormData,
            });
            const data = await response.json();
            setChurchLink(`${WEB_API_URL}/directory/${data?.link}`);

            setTimeout(() => {
                setShowThanks(true);
                setLoader(false);
            }, 5000);
        } catch (error) {
            setLoader(false);
            console.error(error);
        }
    }

    return (
        <section id="contact" className="scroll-mt-12 pt-42">
            <div className="container">
                <div className="row mb-10">
                    <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
                        <h2 className="mb-3">Church Directory</h2>
                        <span className="inline-flex rounded-md bg-green-400 px-2 py-1 text-xs font-extrabold text-white-400 inset-ring inset-ring-green-600/20">
                            NEW APPLICATION
                        </span>
                    </div>
                    {loader && (
                        <div className="flex items-center justify-center mt-4">
                            <h4>Submitting...</h4>
                            <svg
                                className="animate-spin h-5 w-5 text-gray-500"
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
                    )}
                    <div
                        className="text-stone text-center text-lg mb-4.5 mt-1 gap-2"
                        hidden={!showThanks}
                    >
                        Application has been submitted. You can view the
                        application{" "}
                        <a
                            href={churchLink}
                            className="font-bold text-primary hover:underline"
                        >
                            {churchLink}
                        </a>
                    </div>
                </div>

                <div
                    className="relative border px-6 py-2 rounded-lg border-black/20 dark:border-white/20"
                    hidden={showThanks}
                >
                    <PastorForm
                        handleSubmit={handleSubmit}
                        loader={loader}
                        applicationEnabled={applicationEnabled}
                        setPhotoData={setPhotoData}
                        initialValues={null}
                    />
                </div>
            </div>
        </section>
    );
}
