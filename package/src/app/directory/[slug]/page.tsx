"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DaughterForm from "../daughterForm";
import GrandDaughterForm from "../grandDaughterForm";
import { API_URL } from "@/lib/config";

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export default function Directory({ params }: Props) {
    const router = useRouter();
    const { slug } = React.use(params);
    const churchLink = slug;
    const [formData, setFormData] = useState({
        full_name: "",
        mobile: "",
        address: "",
        photo: "",
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

    const [showThanks, setShowThanks] = useState(false);
    const [loader, setLoader] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [applicationFound, setApplicationFound] = useState(false);
    const [applicationEnabled, setApplicationEnabled] = useState(false);

    const churchForm = () => {
        fetch(`${API_URL}/directory/${churchLink}`)
            .then((response) => {
                if (!response.ok && response.status === 404) {
                    setApplicationFound(false);
                    setApplicationEnabled(false);
                    return null;
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.link) {
                    setApplicationEnabled(
                        data.status == "OPENED" ? true : false,
                    );
                    setApplicationFound(true);

                    setFormData({
                        full_name: data.full_name || "",
                        mobile: data.mobile || "",
                        address: data.address || "",
                        photo: data.photo || "",
                        email: data.email || "",
                        birthday: data.birthday || "",
                        wife_name: data.wife_name || "",
                        mother_church_city: data.mother_church_city || "",
                        role: data.role || "",
                        region: data.region || "",
                        city: data.city || "",
                        longitude: data.longitude || "",
                        latitude: data.latitude || "",
                        landmark: data.landmark || "",
                    });

                    setDaughterFormsList(data.daughters || []);
                    setGrandDaughterFormsList(data.granddaughters || []);

                    data.daughters.forEach((daughter, index) => {
                        if (daughter.photo) {
                            setPhotoDaughterData((prev) => {
                                const updatedPhotos = [...(prev.photo || [])];
                                updatedPhotos[index] = daughter.photo;
                                return { photo: updatedPhotos };
                            });
                        }
                    });

                    data.granddaughters.forEach((granddaughter, index) => {
                        if (granddaughter.photo) {
                            setPhotoGrandDaughterData((prev) => {
                                const updatedPhotos = [...(prev.photo || [])];
                                updatedPhotos[index] = granddaughter.photo;
                                return { photo: updatedPhotos };
                            });
                        }
                    });

                    setPreview(data.photo || null);
                }
            });
    };

    useEffect(() => {
        churchForm();
        console.log(applicationEnabled, applicationFound);
    }, []);

    useEffect(() => {
        const isValid = Object.values(formData).every(
            (value) => value.trim() !== "",
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

    const [photoData, setPhotoData] = useState({
        photo: null as File | null,
    });

    const [newPhotoData, setNewPhotoData] = useState({
        photo: null as File | null,
    });

    const [photoDaughterData, setPhotoDaughterData] = useState({
        photo: [] as File[],
    });

    const [newPhotoDaughterData, setNewPhotoDaughterData] = useState({
        photo: [] as File[],
    });

    const [photoGrandDaughterData, setPhotoGrandDaughterData] = useState({
        photo: [] as File[],
    });

    const [newPhotoGrandDaughterData, setNewPhotoGrandDaughterData] = useState({
        photo: [] as File[],
    });

    const [daughterFormsList, setDaughterFormsList] = useState<
        Record<string, any>[]
    >([]);
    const [grandDaughterFormsList, setGrandDaughterFormsList] = useState<
        Record<string, any>[]
    >([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoader(true);

        const updatePayload = JSON.stringify({
            full_name: formData.full_name,
            mobile: formData.mobile,
            address: formData.address,
            photo: formData.photo,
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

        const updateFormData = new FormData();
        updateFormData.append("directory", updatePayload);

        if (newPhotoData.photo) {
            updateFormData.append("photo", newPhotoData.photo);
        }

        if (newPhotoDaughterData.photo.length > 0) {
            newPhotoDaughterData.photo.forEach((file) => {
                updateFormData.append(`daughter_photos`, file);
            });
        }

        if (newPhotoGrandDaughterData.photo.length > 0) {
            newPhotoGrandDaughterData.photo.forEach((file) => {
                updateFormData.append(`granddaughter_photos`, file);
            });
        }

        fetch(`${API_URL}/directory/${churchLink}`, {
            method: "PUT",
            body: updateFormData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    setShowThanks(true);
                    router.push(`/directory/${data.link}`);

                    setTimeout(() => {
                        setShowThanks(false);
                    }, 5000);
                }
            })
            .catch((error) => {
                setLoader(false);
                console.log(error.message);
            });
    };

    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setNewPhotoData({ photo: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <section id="contact" className="scroll-mt-12. pt-42">
            <div className="container">
                <div className="row text-center mb-10">
                    <h2 className=" text-center mb-3">Church Directory</h2>
                    {!applicationFound ? (
                        <div className="text-stone text-lg mb-4.5 mt-1 items-center gap-2">
                            <span className="inline-flex items-center rounded-md bg-red-400 px-2 py-1 text-xs font-extrabold text-white-400 inset-ring inset-ring-green-600/20 mb-2">
                                NOT FOUND
                            </span>
                            <br />
                            Sorry the form you are looking for is not found. You
                            can contact us for the link if you have already
                            submitted an application.
                        </div>
                    ) : !applicationEnabled ? (
                        <div className="text-stone text-lg mb-4.5 mt-1 items-center gap-2">
                            <span className="inline-flex items-center rounded-md bg-red-400 px-2 py-1 text-xs font-extrabold text-white-400 inset-ring inset-ring-green-600/20">
                                DISABLED
                            </span>
                            <br />
                            Sorry you have to ask permission to update this
                            form. Kindly contact us for an update.
                        </div>
                    ) : (
                        <div className="text-stone text-lg mb-4.5 mt-1 items-center gap-2">
                            <span className="inline-flex items-center rounded-md bg-green-400 px-2 py-1 font-extrabold text-xs text-white-400 inset-ring inset-ring-green-600/20">
                                ENABLED
                            </span>
                            <br />
                            You can now fill out the form to update. Form will
                            be reviewed before publishing.
                        </div>
                    )}
                </div>
                <div>
                    <div
                        className="relative border px-6 py-2 rounded-lg border-black/20 dark:border-white/20"
                        hidden={showThanks || !applicationFound}
                    >
                        <form
                            className="flex flex-wrap w-full m-auto justify-between"
                            onSubmit={handleSubmit}
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
                                        <label
                                            className="cursor-pointer rounded-lg bg-blue-900 px-4 py-2 text-white hover:bg-indigo-500 transition"
                                            hidden={!applicationEnabled}
                                        >
                                            Upload Pastor's Photo
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name="photo"
                                                onChange={handleImageChange}
                                                disabled={!applicationEnabled}
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
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
                                        disabled={!applicationEnabled}
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
                                        disabled={!applicationEnabled}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
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
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
                                        disabled={!applicationEnabled}
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
                                        disabled={!applicationEnabled}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
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
                                        disabled={!applicationEnabled}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
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
                                        disabled={!applicationEnabled}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500x"
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
                                            (Church Address)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        disabled={!applicationEnabled}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
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
                                        disabled={!applicationEnabled}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
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
                                        value={formData.region || ""}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
                                        disabled={!applicationEnabled}
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
                                        value={formData.city || ""}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
                                        disabled={!applicationEnabled}
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
                                        value={formData.longitude || ""}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
                                        disabled={!applicationEnabled}
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
                                        type="text"
                                        name="latitude"
                                        value={formData.latitude || ""}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
                                        disabled={!applicationEnabled}
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
                                        value={formData.landmark || ""}
                                        onChange={handleChange}
                                        className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
                                        disabled={!applicationEnabled}
                                    />
                                </div>
                            </div>
                            <div
                                className="container justify-center mt-10"
                                hidden={!applicationEnabled}
                            >
                                <div className="flex gap-6 w-full flex-wrap justify-center">
                                    <div className="align-left justify-start">
                                        <button
                                            type="button"
                                            className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
                                            onClick={addDaughterPastormForm}
                                            disabled={!applicationEnabled}
                                        >
                                            Add Daughter Church
                                        </button>
                                    </div>
                                    <div className="align-right justify-start">
                                        <button
                                            type="button"
                                            className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
                                            onClick={addGrandDaughterForm}
                                            disabled={!applicationEnabled}
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
                                    applicationEnabled={applicationEnabled}
                                    photoDaughterData={photoDaughterData}
                                    setPhotoDaughterData={
                                        setNewPhotoDaughterData
                                    }
                                    newPhotoDaughterData={newPhotoDaughterData}
                                    setNewPhotoDaughterData={
                                        setNewPhotoDaughterData
                                    }
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
                                    applicationEnabled={applicationEnabled}
                                    photoGrandDaughterData={
                                        photoGrandDaughterData
                                    }
                                    setPhotoGrandDaughterData={
                                        setNewPhotoGrandDaughterData
                                    }
                                    newPhotoGrandDaughterData={
                                        newPhotoGrandDaughterData
                                    }
                                    setNewPhotoGrandDaughterData={
                                        setNewPhotoGrandDaughterData
                                    }
                                />
                            ))}

                            <div
                                className="mx-0 my-2.5 w-full"
                                hidden={!applicationEnabled}
                            >
                                <button
                                    type="submit"
                                    disabled={!isFormValid}
                                    className={`border leading-none px-6 text-lg font-medium py-4 rounded-lg 
                    ${
                        !isFormValid
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-primary border-primary text-white hover:bg-transparent hover:text-primary cursor-pointer"
                    }`}
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
