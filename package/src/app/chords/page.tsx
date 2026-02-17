"use client";
import React, { useMemo } from "react";
import { useState, useEffect, use } from "react";
import { scroller, Element } from "react-scroll";
import { API_URL } from "@/lib/config";
interface FastSong {
    id: number; // Unique identifier for the product
    name: string; // Category of the product
    webViewLink: string;
}
export default function Chords() {
    const [value, setValue] = useState("");
    const [allSongs, setAllSongs] = useState<FastSong[]>([]);

    const [fastSongs, setFastSongs] = useState<FastSong[]>([]);
    const [slowSongs, setSlowSongs] = useState<FastSong[]>([]);
    const [conferenceSongs, setConferenceSongs] = useState<FastSong[]>([]);

    const [activeSong, setActiveSong] = useState<FastSong | null>(null);
    const [isChecked, setIsChecked] = useState(true);

    /* Filter first */
    const filteredSongs = useMemo(() => {
        return value
            ? allSongs.filter((song) =>
                  song.name.toLowerCase().includes(value.toLowerCase()),
              )
            : allSongs;
    }, [allSongs, value]);

    function getChords(song: FastSong) {
        scroller.scrollTo("chordslayout", {
            duration: 1500,
            delay: 10,
            smooth: true,
        });
        setActiveSong(song);
    }

    const fastUrl = `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/drive/${process.env.NEXT_PUBLIC_FAST_SONG_SHEET_ID}`;
    const slowUrl = `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/drive/${process.env.NEXT_PUBLIC_SLOW_SONG_SHEET_ID}`;
    const conferenceUrl = `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/drive/${process.env.NEXT_PUBLIC_CONFERENCE_SONG_SHEET_ID}`;

    const fetchSongs = async (
        category: "fast" | "slow" | "conference",
        action: "setFastSongs" | "setSlowSongs" | "setConferenceSongs",
    ) => {
        try {
            const url =
                category === "fast"
                    ? fastUrl
                    : category === "slow"
                      ? slowUrl
                      : conferenceUrl;
            const response = await fetch(url, { method: "GET" });

            console.log(`Fetching ${category} songs from:`, url);
            console.log(`Response for ${category} songs:`, response);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch ${category} songs: ${response.statusText}`,
                );
            }
            const data = await response.json();
            if (action === "setFastSongs") {
                setFastSongs(data);
            } else if (action === "setSlowSongs") {
                setSlowSongs(data);
            } else {
                setConferenceSongs(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSongs("fast", "setFastSongs");
        fetchSongs("slow", "setSlowSongs");
        fetchSongs("conference", "setConferenceSongs");
    }, []);

    useEffect(() => {
        setAllSongs([...fastSongs, ...slowSongs, ...conferenceSongs]);
    }, [fastSongs, slowSongs, conferenceSongs]);

    return (
        <section className="bg-stone-900 mx-auto lg:p-10 sm:p-4 md:p-10 text-white xl:mt-30 lg:mt-20 md:mt-20 mt-20">
            <div className="bg-stone-900 mx-auto lg:p-5 sm:p-4 md:p-5 text-white">
                <div className="p-4">
                    <h1 className="text-center font-bold text-white text-4xl">
                        Praise & Worship
                    </h1>
                    <p className="mx-auto font-normal text-center my-6 max-w-lg text-white">
                        Search the title or lyrics of the song. Find chords and
                        lyrics for your favorite praise and worship songs.
                    </p>
                    <div className="grid justify-items-center">
                        <div className="bg-white rounded-lg overflow-hidden px-2 py-2 xl:w-1/2 lg:w-1/2 md:w-1/2 w-full">
                            <input
                                className="text-stone-400 outline-none xl:w-1/2 lg:w-1/2 md:w-1/2 w-full"
                                onChange={(event) =>
                                    setValue(event.target.value)
                                }
                                value={value}
                                type="text"
                                placeholder="Search Title of the Song"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-stone-900 mx-auto lg:p-5 sm:p-4 md:p-5 text-white">
                <div className="border border-gray-300 shadow-sm rounded-lg overflow-hidden max-w-sm mx-auto mb-6">
                    {/* Scroll container */}
                    <div className="max-h-40 overflow-y-auto">
                        {" "}
                        {/* adjust height as needed */}
                        <table className="w-full text-sm leading-5">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    {value.length > 0 ? (
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Search "{value}" Total{" "}
                                            {filteredSongs.length} Found
                                        </th>
                                    ) : (
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            All Songs Total {allSongs.length}
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {value.length > 0 &&
                                    filteredSongs.map((song) => (
                                        <tr
                                            key={song.id}
                                            className={`cursor-pointer ${
                                                activeSong?.id === song.id
                                                    ? "bg-blue-900"
                                                    : "hover:bg-gray-700"
                                            }`}
                                            onClick={() => getChords(song)}
                                        >
                                            <td className="py-3 px-4 border-t border-gray-300">
                                                {song.name}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="row">
                    <div className="grid lg:grid-cols-3 sm:grid-cols-1 mx-auto sm:justify-center">
                        <div className="w-full mb-6 lg:pl-4">
                            <div className="bg-stone-900 text-sm text-white font-bold px-5 py-2 shadow border-b border-gray-300">
                                Fast Song
                            </div>
                            <div
                                className="w-full h-64 overflow-auto shadow bg-white"
                                id="journal-scroll"
                            >
                                <table className="w-full">
                                    <tbody className="">
                                        {fastSongs.map((song) => [
                                            <tr
                                                className="group relative transform scale-100 text-xs py-1 border-b-2 border-stone-200 cursor-default hover:bg-blue-900"
                                                onClick={() => getChords(song)}
                                            >
                                                <td className="pl-5 pr-3 whitespace-no-wrap">
                                                    <div className="text-stone-400 group-hover:text-white"></div>
                                                    <div className="text-stone-500 group-hover:text-white font-medium">
                                                        GDOC
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-no-wrap">
                                                    <div className="leading-5 text-stone-500 group-hover:text-white font-medium"></div>
                                                    <div className="leading-5 text-stone-800 group-hover:text-white font-medium text-lg">
                                                        {song.name}
                                                    </div>
                                                </td>
                                            </tr>,
                                        ])}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="w-full mb-6 lg:pl-4">
                            <div className="bg-stone-900 text-sm text-white font-bold px-5 py-2 shadow border-b border-gray-300">
                                Slow Song
                            </div>
                            <div
                                className="w-full h-64 overflow-auto shadow bg-white"
                                id="journal-scroll"
                            >
                                <table className="w-full">
                                    <tbody className="">
                                        {slowSongs.map((song) => [
                                            <tr
                                                className="group relative transform scale-100 text-xs py-1 border-b-2 border-stone-200 cursor-default hover:bg-blue-900"
                                                onClick={() => getChords(song)}
                                            >
                                                <td className="pl-5 pr-3 whitespace-no-wrap">
                                                    <div className="text-stone-400 group-hover:text-white"></div>
                                                    <div className="text-stone-500 group-hover:text-white font-medium">
                                                        GDOC
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-no-wrap">
                                                    <div className="leading-5 text-stone-500 group-hover:text-white font-medium"></div>
                                                    <div className="leading-5 text-stone-800 group-hover:text-white font-medium text-lg">
                                                        {song.name}
                                                    </div>
                                                </td>
                                            </tr>,
                                        ])}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="w-full lg:pl-4">
                            <div className="bg-stone-900 text-sm text-white font-bold px-5 py-2 shadow border-b border-gray-300">
                                Conference Song Sheet
                            </div>
                            <div
                                className="w-full h-64 overflow-auto shadow bg-white"
                                id="journal-scroll"
                            >
                                <table className="w-full">
                                    <tbody className="">
                                        {conferenceSongs.map((song) => [
                                            <tr
                                                className="group relative transform scale-100 text-xs py-1 border-b-2 border-stone-200 cursor-default hover:bg-blue-900"
                                                onClick={() =>
                                                    window.open(
                                                        song.webViewLink,
                                                        "_blank",
                                                    )
                                                }
                                            >
                                                <td className="pl-5 pr-3 whitespace-no-wrap">
                                                    <div className="text-stone-400 group-hover:text-white"></div>
                                                    <div className="text-stone-500 group-hover:text-white font-medium">
                                                        PDF
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-no-wrap">
                                                    <div className="leading-5 text-stone-500 group-hover:text-white font-medium"></div>
                                                    <div className="leading-5 text-stone-800 group-hover:text-white font-medium text-lg">
                                                        {song.name}
                                                    </div>
                                                </td>
                                            </tr>,
                                        ])}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="justify-center mt-4">
                    <div
                        className="items-center gap-3 bg-white dark:bg-darklight p-2 rounded-lg w-max mx-auto mb-4"
                        hidden={!activeSong}
                    >
                        <div>
                            <input
                                type="checkbox"
                                id="chordsToggle"
                                checked={isChecked}
                                onChange={() => setIsChecked(!isChecked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                                htmlFor="chordsToggle"
                                className="text-large text-gray-700 pl-2 inline-block"
                            >
                                Show Chords
                            </label>
                        </div>
                    </div>
                    <div
                        className="items-center gap-3 bg-white dark:bg-darklight p-2 rounded-lg w-max mx-auto mb-4"
                        hidden={!activeSong}
                    >
                        <button
                            onClick={() =>
                                window.open(activeSong?.webViewLink, "_blank")
                            }
                            className="text-sm text-blue-500 underline inline-block p-4 dark:bg-darklight px-2 py-1 rounded-lg"
                        >
                            Open in Google Docs
                        </button>
                    </div>

                    <Element name="chordslayout" className="element">
                        <div className="w-full h-[70vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] rounded-lg border border-gray-200 dark:border-gray-800">
                            <iframe
                                hidden={!activeSong}
                                src={`${API_URL}/drive/preview-html/${activeSong?.id}?chords=${isChecked}`}
                                className="
                                    w-full
                                    h-[70vh]
                                    sm:h-[70vh]
                                    md:h-[80vh]
                                    lg:h-[85vh]
                                    rounded-lg
                                    border border-gray-200 dark:border-gray-800
                                    "
                            />
                        </div>
                    </Element>
                </div>
            </div>
        </section>
    );
}
