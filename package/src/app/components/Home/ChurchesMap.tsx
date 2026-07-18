"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const churches = [
    { id: 1, name: "PHCC Manila", city: "Manila", lat: 14.5738, lng: 121.0451 },
    {
        id: 2,
        name: "PHCC Cebu",
        city: "Cebu City",
        lat: 10.3157,
        lng: 123.8854,
    },
    {
        id: 3,
        name: "PHCC Davao",
        city: "Davao City",
        lat: 7.1907,
        lng: 125.4553,
    },
    {
        id: 4,
        name: "PHCC Quezon City",
        city: "Quezon City",
        lat: 14.676,
        lng: 121.0437,
    },
    {
        id: 5,
        name: "PHCC Iloilo",
        city: "Iloilo City",
        lat: 10.7202,
        lng: 122.5621,
    },
    {
        id: 6,
        name: "PHCC Tacloban",
        city: "Tacloban City",
        lat: 8.4542,
        lng: 124.6319,
    },
    {
        id: 7,
        name: "PHCC Lucena",
        city: "Lucena City",
        lat: 6.9214,
        lng: 122.079,
    },
    {
        id: 8,
        name: "PHCC Baguio",
        city: "Baguio City",
        lat: 16.4023,
        lng: 120.596,
    },
];

const MapComponent = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function ChurchesMap() {
    return (
        <section className="px-12 mx-auto max-w-7xl mt-16">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">
                    Our Churches Across the Philippines
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    Spreading the Gospel nationwide
                </p>
                <div className="flex justify-center gap-10">
                    <div className="text-center">
                        <span className="text-5xl font-extrabold text-blue-700">
                            300+
                        </span>
                        <p className="text-gray-500 text-sm mt-1">Churches</p>
                    </div>
                    <div className="text-center">
                        <span className="text-5xl font-extrabold text-blue-700">
                            18
                        </span>
                        <p className="text-gray-500 text-sm mt-1">Regions</p>
                    </div>
                    <div className="text-center">
                        <span className="text-5xl font-extrabold text-blue-700">
                            1000+
                        </span>
                        <p className="text-gray-500 text-sm mt-1">Members</p>
                    </div>
                </div>
            </div>
            <MapComponent churches={churches} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {churches.map((church) => (
                    <div
                        key={church.id}
                        className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 shadow-sm"
                    >
                        <span className="text-blue-700 text-lg">📍</span>
                        <div>
                            <p className="font-semibold text-sm">
                                {church.name}
                            </p>
                            <p className="text-xs text-gray-400">
                                {church.city}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
