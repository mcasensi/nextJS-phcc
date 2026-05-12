"use client";
import React from "react";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/config";
import PastorForm from "../pastorForm";
import { useParams } from "react-router-dom";

export default function Directory() {
  const { slug = "" } = useParams<{ slug: string }>();
  const churchLink = slug;

  const [initialValues, setInitialValues] = useState<any>(null);
  const [loader, setLoader] = useState(false);
  const [applicationEnabled, setApplicationEnabled] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [photoData, setPhotoData] = useState<{ photo: File | null }>({
    photo: null,
  });

  const fetchData = () => {
    fetch(`${API_URL}/directory/${churchLink}`)
      .then((response) => {
        setNotFound(false);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "DISABLED") {
          setApplicationEnabled(false);
        } else {
          setApplicationEnabled(true);
        }
        setInitialValues(data);
      })
      .catch((error) => {
        console.error("Error fetching directory data:", error);
        setApplicationEnabled(false);
        setNotFound(true);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(values: any) {
    setLoader(true);
    setApplicationEnabled(false);

    const payload = JSON.stringify({
      ...values,
    });

    const newFormData = new FormData();
    newFormData.append("directory", payload);

    if (photoData.photo) {
      newFormData.append("photo", photoData.photo as File);
    }

    try {
      await fetch(`${API_URL}/directory/${churchLink}`, {
        method: "PUT",
        body: newFormData,
      });

      setTimeout(() => {
        setLoader(false);
        setApplicationEnabled(true);
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
            {applicationEnabled ? (
              <div className="items-center gap-2">
                <label className="text-gray-500">Application is open for submission</label>
                <br />
                <span className="inline-flex rounded-md bg-green-400 px-2 py-1 text-xs font-extrabold text-white-400 inset-ring inset-ring-green-600/20">
                  OPENED
                </span>
              </div>
            ) : notFound ? (
              <div className="items-center gap-2">
                <label className="text-gray-500">
                  No directory found. Contact us if you have submitted an application.
                </label>
                <br />
                <span className="inline-flex rounded-md bg-red-400 px-2 py-1 text-xs font-extrabold text-white-400 inset-ring inset-ring-red-600/20">
                  NOT FOUND
                </span>
              </div>
            ) : (
              <div className="items-center gap-2">
                <label className="text-gray-500">
                  Application is currently closed for submission. Contact us if you want to update your directory
                  information.
                </label>
                <br />
                <span className="inline-flex rounded-md bg-red-400 px-2 py-1 text-xs font-extrabold text-white-400 inset-ring inset-ring-red-600/20">
                  DISABLED
                </span>
              </div>
            )}
          </div>
          {loader && (
            <div className="flex items-center justify-center mt-4">
              <h4>Updating...</h4>
              <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        {initialValues && (
          <div className="relative border px-6 py-2 rounded-lg border-black/20 dark:border-white/20">
            <PastorForm
              handleSubmit={handleSubmit}
              loader={loader}
              applicationEnabled={applicationEnabled}
              setPhotoData={setPhotoData}
              initialValues={initialValues}
            />
          </div>
        )}
      </div>
    </section>
  );
}
