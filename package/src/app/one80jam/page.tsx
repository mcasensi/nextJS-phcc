"use client";

import { useState, useEffect, useMemo } from "react";
import { one80JamGenre } from "../types/one80JamGenre";
import { one80JamSong } from "../types/one80JamSong";
import { API_URL } from "@/lib/config";

const formMode = process.env.NEXT_PUBLIC_NEXT_MODE ?? "production";

export default function One80Jam() {
    const [value, setValue] = useState("");
    const [allGenres, setAllGenres] = useState<one80JamGenre[]>([]);
    const [allSong, setAllSong] = useState<one80JamSong[]>([]);
    const [allFilteredSong, setAllFilteredSong] = useState<one80JamSong[]>([]);
    const [genreId, setGenreId] = useState<number | 0>(0);
    const [activeSong, setActiveSong] = useState<one80JamSong | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newSong, setNewSong] = useState({
        song_title: "",
        lyrics: "",
        genre_ids: [] as number[],
    });

    useEffect(() => {
        if (formMode === "development") {
            setShowAddForm(false);
        }

        fetch(`${API_URL}/public-one80jam/genres?skip=0&limit=100`)
            .then((response) => response.json())
            .then((data) => setAllGenres(data));

        fetchSongs();
    }, []);

    const fetchSongs = () => {
        fetch(`${API_URL}/public-one80jam/song_genres?skip=0&limit=100`)
            .then((response) => response.json())
            .then((data: one80JamSong[]) => {
                setAllSong(data);
                setAllFilteredSong(data);
            });
    };

    const toggleGenre = (id: number) => {
        setNewSong((prev) => ({
            ...prev,
            genre_ids: prev.genre_ids.includes(id)
                ? prev.genre_ids.filter((g) => g !== id)
                : [...prev.genre_ids, id],
        }));
    };

    const handleAddEntry = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(
                `${API_URL}/public-one80jam/song_genres`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        song_title: newSong.song_title,
                        lyrics: newSong.lyrics,
                        genre_id: newSong.genre_ids, // multiple genre IDs
                    }),
                },
            );

            if (!response.ok) throw new Error("Failed to add entry");

            setNewSong({ song_title: "", lyrics: "", genre_ids: [] });
            setShowAddForm(false);
            fetchSongs();
        } catch (error) {
            console.error("Error adding entry:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSongByGenre = (genreId: number) => {
        setAllFilteredSong(
            allSong.filter((song) => {
                return Array.isArray(song.genre_id)
                    ? song.genre_id.includes(genreId)
                    : song.genre_id === genreId;
            }),
        );
    };

    const filteredSongs = useMemo(() => {
        return value
            ? allFilteredSong.filter((song) =>
                  song.song_title.toLowerCase().includes(value.toLowerCase()),
              )
            : allFilteredSong;
    }, [allFilteredSong, value]);

    const handleSetGenreId = (id: number) => {
        console.log("Selected Genre ID:", id);
        if (id === 0) {
            setGenreId(0);
            fetchSongs();
            setAllFilteredSong(allSong);
        } else {
            setGenreId(id);
            getSongByGenre(id);
        }
    };

    const downloadPDF = (id: number) => {
        console.log("Downloading PDF for song ID:", id);
        fetch(`${API_URL}/public-one80jam/download-pdf/${id}`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to download PDF");
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${id}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error("Error downloading PDF:", error);
            });
    };

    return (
        <section className="bg-stone-900 mx-auto lg:p-10 sm:p-4 md:p-10 text-white xl:mt-30 lg:mt-20 md:mt-20 mt-20">
            <div className="p-4">
                <h1 className="text-center font-bold text-white text-4xl">
                    one80JAM
                </h1>
                <p className="mx-auto font-normal text-center my-6 max-w-lg text-white">
                    Search the title or lyrics of the song. Christian Version
                    available and other genres. Ideas and themes by using tags
                    below.
                </p>

                <div className="grid justify-items-center">
                    <div className="bg-white rounded-lg overflow-hidden px-2 py-2 w-1/2">
                        <input
                            className="text-stone-400 outline-none w-1/2"
                            type="text"
                            onChange={(event) => {
                                setValue(event.target.value);
                            }}
                            value={value}
                            placeholder="Search Title of the Song"
                        />
                    </div>
                    {formMode !== "development" && (
                        <button
                            type="button"
                            className="bg-emerald-600 hover:bg-emerald-700 rounded px-4 py-2 font-semibold text-white"
                            onClick={() => setShowAddForm((prev) => !prev)}
                        >
                            {showAddForm ? "Close Form" : "Add New Entry"}
                        </button>
                    )}

                    {formMode !== "development" && showAddForm && (
                        <form
                            onSubmit={handleAddEntry}
                            className="w-full max-w-xl mt-4 rounded-lg bg-white p-4 text-stone-900 shadow"
                        >
                            <div className="mb-4 border-b border-stone-200 pb-3">
                                <h2 className="text-xl font-bold text-stone-900">
                                    Add New Song Entry
                                </h2>
                                <p className="text-sm text-stone-600">
                                    Fill in the details below.
                                </p>
                            </div>

                            <input
                                type="text"
                                placeholder="Song title"
                                value={newSong.song_title}
                                onChange={(e) =>
                                    setNewSong((prev) => ({
                                        ...prev,
                                        song_title: e.target.value,
                                    }))
                                }
                                className="w-full mb-3 p-2 rounded border border-stone-300 text-black"
                                required
                            />
                            <textarea
                                placeholder="Lyrics"
                                value={newSong.lyrics}
                                onChange={(e) =>
                                    setNewSong((prev) => ({
                                        ...prev,
                                        lyrics: e.target.value,
                                    }))
                                }
                                className="w-full mb-3 p-2 rounded border border-stone-300 text-black min-h-32"
                                required
                            />
                            <div className="mb-3">
                                <p className="text-sm font-semibold mb-2">
                                    Genres (select multiple)
                                </p>
                                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto border border-stone-300 rounded p-2">
                                    {allGenres.map((genre) => (
                                        <label
                                            key={genre.id}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={newSong.genre_ids.includes(
                                                    genre.id,
                                                )}
                                                onChange={() =>
                                                    toggleGenre(genre.id)
                                                }
                                            />
                                            <span>{genre.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white py-2 px-4 rounded"
                            >
                                {isSubmitting ? "Saving..." : "Save Entry"}
                            </button>
                        </form>
                    )}

                    {!showAddForm && allGenres && (
                        <div className="flex flex-wrap justify-center items-center pt-2">
                            <div>
                                <div className="p-2">
                                    <button
                                        type="button"
                                        className={`py-2 px-4 bg-blue-900 text-stone-100 p-2 rounded-full leading-none flex items-center text-xs ${genreId === 0 ? "bg-green-500" : ""}`}
                                        onClick={() => {
                                            handleSetGenreId(0);
                                        }}
                                    >
                                        ALL
                                    </button>
                                </div>
                            </div>
                            {allGenres.map((genre) => (
                                <div key={genre.id}>
                                    <div className="p-2">
                                        <button
                                            type="button"
                                            className={`py-2 px-4 bg-blue-900 text-stone-100 p-2 rounded-full leading-none flex items-center text-xs ${genreId === genre.id ? "bg-green-500" : ""}`}
                                            onClick={() => {
                                                handleSetGenreId(genre.id);
                                            }}
                                        >
                                            #{genre.name}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border border-gray-300 shadow-sm mt-5 rounded-lg overflow-hidden max-w-sm mx-auto mb-6">
                    <div className="h-62 overflow-y-auto">
                        <table className="w-full text-sm leading-5">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th
                                        className={`py-3 px-4 text-left font-medium text-gray-600 ${
                                            genreId ? "bg-gray-200" : ""
                                        }`}
                                    >
                                        {genreId
                                            ? `Genre: ${allGenres.find((genre) => genre.id === genreId)?.name ?? ""}`
                                            : allSong.length > 0
                                              ? `All Songs Total ${allSong.length}`
                                              : ""}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSongs.map((song) => (
                                    <tr
                                        key={song.id}
                                        className={`cursor-pointer ${
                                            activeSong?.id === song.id
                                                ? "bg-blue-900"
                                                : "hover:bg-gray-700"
                                        }`}
                                        onClick={setActiveSong.bind(null, song)}
                                    >
                                        <td className="py-3 px-4 border-t border-gray-300">
                                            {song.song_title}
                                        </td>
                                        <td className="py-3 px-4 border-t border-gray-300">
                                            {Array.isArray(song.genre_name)
                                                ? song.genre_name.join(", ")
                                                : song.genre_name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div
                    className="container pt-10 text-center"
                    hidden={!activeSong}
                >
                    <h1 className="text-4xl text-white font-bold mb-8">
                        {activeSong?.song_title}
                    </h1>

                    <button
                        className="bg-red-700 hover:bg-red-800 text-white mb-5 font-bold py-2 px-2 rounded"
                        onClick={() => downloadPDF(activeSong!.id)}
                    >
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-10 w-10 text-red-600"
                            >
                                <path d="M6 2h7l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                                <path
                                    d="M13 2v6h6"
                                    fill="white"
                                    opacity="0.5"
                                />
                            </svg>
                            Export PDF
                        </div>
                    </button>
                    <div className="container justify-content-center text-center">
                        <pre className="text-stone-800 whitespace-pre-wrap bg-gray-100 p-4 rounded">
                            {activeSong?.lyrics}
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    );
}
