"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    getAllRegions,
    getBarangaysByMunicipality,
    getMunicipalitiesByProvince,
    getProvincesByRegion,
} from "@aivangogh/ph-address";
import { useState, SetStateAction } from "react";

const validationSchema = Yup.object().shape({
    full_name: Yup.string().required("Full name is required"),
    mobile: Yup.string().required("Mobile number is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string().email("Invalid email").nullable(),
    birthday: Yup.string().nullable(),
    wife_name: Yup.string().nullable(),
    mother_church_city: Yup.string().nullable(),
    role: Yup.string().nullable(),
    region: Yup.string().nullable(),
    province: Yup.string().nullable(),
    municipality: Yup.string().nullable(),
    barangay: Yup.string().nullable(),
    longitude: Yup.string().nullable(),
    latitude: Yup.string().nullable(),
    landmark: Yup.string().nullable(),
});

type PastorFormValues = {
    full_name: string;
    mobile: string;
    address: string;
    email: string;
    birthday: string;
    wife_name: string;
    mother_church_city: string;
    role: string;
    region: string;
    province: string;
    barangay: string;
    municipality: string;
    longitude: string;
    latitude: string;
    landmark: string;
    photo: string;
};

export default function PastorForm({
    handleSubmit,
    loader,
    applicationEnabled,
    setPhotoData,
    initialValues,
}: {
    handleSubmit: (values: PastorFormValues) => Promise<void>;
    loader: boolean;
    applicationEnabled: boolean;
    setPhotoData: React.Dispatch<SetStateAction<{ photo: File | null }>>;
    initialValues: Partial<PastorFormValues> | null;
}) {
    const defaultValues: PastorFormValues = {
        full_name: "",
        mobile: "",
        address: "",
        email: "",
        birthday: "",
        wife_name: "",
        mother_church_city: "",
        role: "",
        region: "",
        province: "",
        barangay: "",
        municipality: "",
        longitude: "",
        latitude: "",
        landmark: "",
        photo: "",
    };

    const formik = useFormik<PastorFormValues>({
        initialValues: {
            ...defaultValues,
            ...(initialValues || {}),
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await handleSubmit(values);
        },
    });

    useEffect(() => {
        if (initialValues) {
            const nextValues: PastorFormValues = {
                ...defaultValues,
                ...initialValues,
            };

            formik.setValues(nextValues);
            handleRegionChange({
                target: { value: nextValues.region },
            } as React.ChangeEvent<HTMLSelectElement>);
            handleProvinceChange({
                target: { value: nextValues.province },
            } as React.ChangeEvent<HTMLSelectElement>);
            handleMunicipalityChange({
                target: { value: nextValues.municipality },
            } as React.ChangeEvent<HTMLSelectElement>);
        }
    }, [initialValues]);

    const regions = getAllRegions();
    const [provinceList, setProvinceList] = useState<any[]>([]);
    const [municipalityList, setMunicipalityList] = useState<any[]>([]);
    const [barangayList, setBarangayList] = useState<any[]>([]);
    const [preview, setPreview] = useState<string | null>(null);

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        formik.handleChange(e);
        setProvinceList([...getProvincesByRegion(e.target.value)]);
        setMunicipalityList([...getMunicipalitiesByProvince(e.target.value)]);
    };

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        formik.handleChange(e);
        setMunicipalityList([...getMunicipalitiesByProvince(e.target.value)]);
    };

    const handleMunicipalityChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        formik.handleChange(e);
        setBarangayList([...getBarangaysByMunicipality(e.target.value)]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotoData({ photo: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <div className="grid w-full flex-row items-center justify-between">
                <div className="align-left">
                    <h2 className="w-full text-lg font-medium mt-8">
                        {formik.values.role} {formik.values.full_name}
                    </h2>
                </div>
            </div>
            <form
                onSubmit={formik.handleSubmit}
                className="flex flex-wrap w-full m-auto justify-between"
                encType="multipart/form-data"
                noValidate
            >
                {/* Photo Upload */}
                <div className="sm:flex gap-6 w-1/4">
                    <div className="mx-0 my-2.5 flex-1">
                        <div className="flex flex-col items-center gap-4">
                            <span
                                className="text-sm text-gray-500"
                                hidden={!applicationEnabled}
                            >
                                (2X2 Front View)
                            </span>
                            <div className="relative h-32 w-32">
                                <img
                                    src={
                                        preview ||
                                        formik.values.photo ||
                                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'><rect cx='75' cy='75' width='150' height='150' fill='%23e5e7eb'/></svg>"
                                    }
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            </div>
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
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Full Name */}
                <div className="sm:flex gap-6 w-full">
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Full Name{" "}
                            <span className="text-sm text-gray-500">
                                (First Name Last Name)
                            </span>
                        </label>
                        <input
                            type="text"
                            {...formik.getFieldProps("full_name")}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                            disabled={!applicationEnabled}
                        />
                        {formik.touched.full_name &&
                            formik.errors.full_name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.full_name}
                                </p>
                            )}
                    </div>
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Wife's Full Name{" "}
                            <span className="text-sm text-gray-500">
                                (First Name Last Name)
                            </span>
                        </label>
                        <input
                            type="text"
                            {...formik.getFieldProps("wife_name")}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                            disabled={!applicationEnabled}
                        />
                        {formik.touched.wife_name &&
                            formik.errors.wife_name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.wife_name}
                                </p>
                            )}
                    </div>
                </div>

                {/* Birthday & Email */}
                <div className="sm:flex gap-6 w-full">
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Birthday
                        </label>
                        <input
                            type="date"
                            {...formik.getFieldProps("birthday")}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                            disabled={!applicationEnabled}
                        />
                        {formik.touched.birthday && formik.errors.birthday && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.birthday}
                            </p>
                        )}
                    </div>
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Email
                        </label>
                        <input
                            type="email"
                            {...formik.getFieldProps("email")}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                            disabled={!applicationEnabled}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Contact & Role */}
                <div className="sm:flex gap-6 w-full">
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            placeholder="+639XXXXX"
                            {...formik.getFieldProps("mobile")}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                            disabled={!applicationEnabled}
                        />
                        {formik.touched.mobile && formik.errors.mobile && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.mobile}
                            </p>
                        )}
                    </div>
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Role{" "}
                            <span className="text-sm text-gray-500">
                                (if pastor/assistant/evangelist)
                            </span>
                        </label>
                        <select
                            {...formik.getFieldProps("role")}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                            disabled={!applicationEnabled}
                        >
                            <option value="">Select Role</option>
                            <option value="Pastor">Pastor</option>
                            <option value="Assistant Pastor">
                                Assistant Pastor
                            </option>
                            <option value="Evangelist">Evangelist</option>
                        </select>
                        {formik.touched.role && formik.errors.role && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.role}
                            </p>
                        )}
                    </div>
                </div>

                {/* Mother Church City */}
                <div className="sm:flex gap-6 w-full">
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Mother Church{" "}
                            <span className="text-sm text-gray-500">
                                (Pastor & Church City)
                            </span>
                        </label>
                        <input
                            type="text"
                            {...formik.getFieldProps("mother_church_city")}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                            disabled={!applicationEnabled}
                        />
                        {formik.touched.mother_church_city &&
                            formik.errors.mother_church_city && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.mother_church_city}
                                </p>
                            )}
                    </div>
                </div>

                {/* Address Section */}
                <div className="sm:flex gap-6 w-full border-b border-gray-200 dark:border-gray-800 pt-6">
                    <h4 className="pb-4">Church Address</h4>
                </div>

                <div className="sm:flex gap-6 w-full pt-6">
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Address{" "}
                            <span className="text-sm text-gray-500">
                                (Street Name, Barangay, etc.)
                            </span>
                        </label>
                        <input
                            type="text"
                            {...formik.getFieldProps("address")}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                            disabled={!applicationEnabled}
                        />
                        {formik.touched.address && formik.errors.address && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.address}
                            </p>
                        )}
                    </div>
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Region
                        </label>
                        <select
                            {...formik.getFieldProps("region")}
                            onChange={handleRegionChange}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                            disabled={!applicationEnabled}
                        >
                            <option value="">Select Region</option>
                            {regions.map((region) => (
                                <option
                                    value={region?.psgcCode}
                                    key={region?.psgcCode}
                                >
                                    {region?.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.region && formik.errors.region && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.region}
                            </p>
                        )}
                    </div>
                    <div
                        className="mx-0 my-2.5 flex-1"
                        hidden={provinceList.length === 0}
                    >
                        <label className="pb-3 inline-block text-base">
                            Province
                        </label>
                        <select
                            {...formik.getFieldProps("province")}
                            onChange={handleProvinceChange}
                            disabled={
                                !formik.values.region || !applicationEnabled
                            }
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                        >
                            <option value="">Select Province</option>
                            {provinceList.map((province) => (
                                <option
                                    value={province?.psgcCode}
                                    key={province?.psgcCode}
                                >
                                    {province?.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.province && formik.errors.province && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.province}
                            </p>
                        )}
                    </div>
                </div>

                {/* Municipality & Barangay */}
                <div
                    className="sm:flex gap-6 w-full"
                    hidden={municipalityList.length === 0}
                >
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Municipality/City
                        </label>
                        <select
                            {...formik.getFieldProps("municipality")}
                            onChange={handleMunicipalityChange}
                            disabled={!applicationEnabled}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                        >
                            <option value="">Select Municipality/City</option>
                            {municipalityList.map((municipality) => (
                                <option
                                    value={municipality?.psgcCode}
                                    key={municipality?.psgcCode}
                                >
                                    {municipality?.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.municipality &&
                            formik.errors.municipality && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.municipality}
                                </p>
                            )}
                    </div>
                    <div
                        className="mx-0 my-2.5 flex-1"
                        hidden={barangayList.length === 0}
                    >
                        <label className="pb-3 inline-block text-base">
                            Barangay
                        </label>
                        <select
                            {...formik.getFieldProps("barangay")}
                            disabled={
                                !formik.values.municipality ||
                                !applicationEnabled
                            }
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                        >
                            <option value="">Select Barangay</option>
                            {barangayList.map((barangay) => (
                                <option
                                    value={barangay?.name}
                                    key={barangay?.name}
                                >
                                    {barangay?.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.barangay && formik.errors.barangay && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.barangay}
                            </p>
                        )}
                    </div>
                </div>

                <div className="sm:flex gap-6 w-full">
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Longitude
                        </label>
                        <input
                            type="number"
                            {...formik.getFieldProps("longitude")}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                            disabled={!applicationEnabled}
                        />
                    </div>
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Latitude
                        </label>
                        <input
                            type="number"
                            disabled={!applicationEnabled}
                            {...formik.getFieldProps("latitude")}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                        />
                    </div>
                    <div className="mx-0 my-2.5 flex-1">
                        <label className="pb-3 inline-block text-base">
                            Landmark
                        </label>
                        <input
                            type="text"
                            disabled={!applicationEnabled}
                            {...formik.getFieldProps("landmark")}
                            className="w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-500"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div
                    className="mx-0 my-2.5 w-full"
                    hidden={!applicationEnabled}
                >
                    <button
                        type="submit"
                        className="border leading-none px-6 text-lg font-medium py-4 rounded-lg bg-primary border-primary text-white hover:bg-transparent hover:text-primary cursor-pointer"
                    >
                        {loader ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
}
