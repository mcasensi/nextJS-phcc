"use client";

import { Event } from "@/app/types/event";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CategorySkeleton from "../../Skeleton/Category";
import { API_URL } from "@/lib/config";

const Timeline = () => {
    const [eventList, setEventList] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const monthToday = new Date().getMonth() + 1;

    useEffect(() => {
        fetch(`${API_URL}/public-events/?skip=0&limit=100&month=` + monthToday)
            .then((res) => res.json())
            .then((data) => {
                setEventList(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching events:", err);
                setLoading(false);
            });
    }, []);

    return (
        <section className="scroll-mt-12">
            <div className="container">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-8">Monthly Events</h1>
                </div>

                <div>
                    <ol className="border-s-2 border-primary dark:border-primary-500">
                        {eventList.map((event, index) => (
                            <li key={index}>
                                <div className="flex-start flex items-center">
                                    <div className="-ms-[9px] -mt-2 me-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary dark:bg-primary-500"></div>
                                    <h4 className="-mt-2 text-xl font-semibold">
                                        {event.title}
                                    </h4>
                                </div>
                                <div className="mb-6 ms-6 pb-6">
                                    <label className="text-sm text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600">
                                        {new Date(
                                            event.start,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </label>
                                    <p className="mb-4 mt-2 text-neutral-600 dark:text-neutral-300">
                                        {event.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
};

export default Timeline;
