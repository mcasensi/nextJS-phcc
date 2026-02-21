"use client";
import React from "react";
import { useState, useEffect } from "react";
import PastorsForm from "./grandDaughterForm";
import DaughterForm from "./daughterForm";
import GrandDaughterForm from "./grandDaughterForm";
import { WEB_API_URL, API_URL } from "@/lib/config";
import { File } from "buffer";

export default function Directory() {
    const [formData, setFormData] = useState({
        full_name: "",
        mobile: "",
        address: "",
        email: "",
        birthday: "",
        wife_name: "",
        mother_church_city: "",
        role: "",
        region: "",
        city: "",
        longitude: "",
        latitude: "",
        landmark: "",
    });

    const [photoData, setPhotoData] = useState({
        photo: null as File | null,
    });

    const [photoDaughterData, setPhotoDaughterData] = useState({
        photo: [] as File[],
    });

    const [photoGrandDaughterData, setPhotoGrandDaughterData] = useState({
        photo: [] as File[],
    });
    const [showThanks, setShowThanks] = useState(false);
    const [loader, setLoader] = useState(false);
    const [churchLink, setChurchLink] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const isValid = Object.values(formData).every(
            (value) => String(value).trim() !== "",
        );
        setIsFormValid(isValid);
    }, [formData]);
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const addDaughterPastormForm = () => {
        setDaughterFormsList((prev) => [...(prev || []), {}]);
    };

    const addGrandDaughterForm = () => {
        setGrandDaughterFormsList((prev) => [...(prev || []), {}]);
    };

    const [daughterFormsList, setDaughterFormsList] = useState<
        Record<string, any>[]
    >([]);
    const [grandDaughterFormsList, setGrandDaughterFormsList] = useState<
        Record<string, any>[]
    >([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoader(true);

        const payload = JSON.stringify({
            full_name: formData.full_name,
            mobile: formData.mobile,
            address: formData.address,
            email: formData.email,
            birthday: formData.birthday,
            wife_name: formData.wife_name,
            mother_church_city: formData.mother_church_city,
            role: formData.role,
            region: formData.region,
            city: formData.city,
            longitude: formData.longitude,
            latitude: formData.latitude,
            landmark: formData.landmark,
            daughters: daughterFormsList,
            granddaughters: grandDaughterFormsList,
        });

        const newFormData = new FormData();
        newFormData.append("directory", payload);

        if (photoData.photo) {
            newFormData.append("photo", photoData.photo);
        }

        if (photoDaughterData.photo.length > 0) {
            photoDaughterData.photo.forEach((file) => {
                newFormData.append(`daughter_photos`, file);
            });
        }

        if (photoGrandDaughterData.photo.length > 0) {
            photoGrandDaughterData.photo.forEach((file) => {
                newFormData.append(`granddaughter_photos`, file);
            });
        }

        fetch(`${API_URL}/directory/`, {
            method: "POST",
            body: newFormData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                setLoader(false);
                console.log(error.message);
            });
    };

    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoData({ photo: file });
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <section id="contact" className="scroll-mt-12. pt-42">
            <div className="container">
                <div className="row text-center mb-10">
                    <h2 className=" text-center mb-3">Church Directory</h2>
                    <span className="inline-flex items-center rounded-md bg-green-400 px-2 py-1 text-xs font-extrabold text-white-400 inset-ring inset-ring-green-600/20">
                        NEW APPLICATION
                    </span>
                    <div
                        className="text-stone text-lg mb-4.5 mt-1 items-center gap-2"
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
                <div>
                    <div
                        className="relative border px-6 py-2 rounded-lg border-black/20 dark:border-white/20"
                        hidden={showThanks}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-wrap w-full m-auto justify-between"
                            encType="multipart/form-data"
                        >
                            <div className="sm:flex gap-6 w-1/4">
                                <div className="mx-0 my-2.5 flex-1">
                                    <div className="flex flex-col items-center gap-4">
                                        {/* Avatar */}
                                        <div className="relative h-32 w-32">
                                            <img
                                                src={
                                                    preview ||
                                                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'><rect cx='75' cy='75' width='150' height='150' fill='%23e5e7eb'/></svg>"
                                                }
                                                alt="Profile"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        {/* File Input */}
                                        <label className="cursor-pointer rounded-lg bg-blue-900 px-4 py-2 text-white hover:bg-indigo-500 transition">
                                            Upload Pastor's Photo
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name="photo"
                                                onChange={(event) => {
                                                    handleImageChange(event);
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="sm:flex gap-6 w-full">
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Full Name{" "}
                                        <span className="text-sm text-gray-500">
                                            (First Name Last Name)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Wife's Full Name{" "}
                                        <span className="text-sm text-gray-500">
                                            (First Name Last Name)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="wife_name"
                                        value={formData.wife_name}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                            </div>
                            <div className="sm:flex gap-6 w-full">
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Birthday
                                    </label>
                                    <input
                                        type="date"
                                        name="birthday"
                                        value={formData.birthday}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                            </div>
                            <div className="sm:flex gap-6 w-full">
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
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Role{" "}
                                        <span className="text-sm text-gray-500">
                                            (if pastor/assistant/evangelist)
                                        </span>
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Pastor">Pastor</option>
                                        <option value="Assistant Pastor">
                                            Assistant Pastor
                                        </option>
                                        <option value="Evangelist">
                                            Evangelist
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="sm:flex gap-6 w-full">
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Address{" "}
                                        <span className="text-sm text-gray-500">
                                            (Stree Name, Barangay, etc.)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Mother Church City
                                    </label>
                                    <input
                                        type="text"
                                        name="mother_church_city"
                                        value={formData.mother_church_city}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                            </div>
                            <div className="sm:flex gap-6 w-full">
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Region
                                    </label>
                                    <input
                                        type="text"
                                        name="region"
                                        value={formData.region}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                            </div>
                            <div className="sm:flex gap-6 w-full">
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                                <div className="mx-0 my-2.5 flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="pb-3 inline-block text-base"
                                    >
                                        Landmark
                                    </label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={formData.landmark}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0"
                                    />
                                </div>
                            </div>
                            <div className="container justify-center mt-10">
                                <div className="flex gap-6 w-full flex-wrap justify-center">
                                    <div className="align-left justify-start">
                                        <button
                                            type="button"
                                            className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
                                            onClick={addDaughterPastormForm}
                                        >
                                            Add Daughter Church
                                        </button>
                                    </div>
                                    <div className="align-right justify-start">
                                        <button
                                            type="button"
                                            className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
                                            onClick={addGrandDaughterForm}
                                        >
                                            Add GrandDaughter Church
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {daughterFormsList.map((_, i) => (
                                <DaughterForm
                                    key={i}
                                    headerTitle={`Daughter Church ${i + 1}`}
                                    index={i}
                                    daughterFormsList={daughterFormsList}
                                    setDaughterFormsList={setDaughterFormsList}
                                    applicationEnabled={true}
                                />
                            ))}

                            {grandDaughterFormsList.map((_, i) => (
                                <GrandDaughterForm
                                    key={i}
                                    headerTitle={`GrandDaughter Church ${i + 1}`}
                                    index={i}
                                    grandDaughterFormsList={
                                        grandDaughterFormsList
                                    }
                                    setGrandDaughterFormsList={
                                        setGrandDaughterFormsList
                                    }
                                    applicationEnabled={true}
                                />
                            ))}

                            <div className="mx-0 my-2.5 w-full">
                                <button
                                    type="submit"
                                    className={`border leading-none px-6 text-lg font-medium py-4 rounded-lg 
                    ${
                        !isFormValid
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-primary border-primary text-white hover:bg-transparent hover:text-primary cursor-pointer"
                    }`}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
