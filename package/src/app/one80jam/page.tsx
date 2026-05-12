"use client";
import { useState, useEffect, useMemo } from "react";
import { one80JamGenre } from "../types/one80JamGenre";
import { one80JamSong } from "../types/one80JamSong";
import { API_URL, WEB_API_URL } from "@/lib/config";
import { scroller, Element } from "react-scroll";

export default function One80Jam() {
    const [value, setValue] = useState("");
    const [allGenres, setAllGenres] = useState<one80JamGenre[]>([]);
    const [allSong, setAllSong] = useState<one80JamSong[]>([]);
    const [allFilteredSong, setAllFilteredSong] = useState<one80JamSong[]>([]);
    const [genreId, setGenreId] = useState<number | 0>(0);
    const [activeSong, setActiveSong] = useState<one80JamSong | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/public-one80jam/genres?skip=0&limit=100`)
            .then((response) => response.json())
            .then((data) => setAllGenres(data));
        fetchSongs();
    }, []);

    const fetchSongs = () => {
        fetch(`${API_URL}/public-one80jam/song_genres?skip=0&limit=100`)
            .then((response) => response.json())
            .then((data: one80JamSong[]) => setAllSong(data));
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

    /* Filter first */
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
                    {allGenres && (
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
                    <div className="max-h-40 overflow-y-auto">
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
                                {(Array.isArray(filteredSongs)
                                    ? filteredSongs
                                    : []
                                ).map((song) => (
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
                    <div
                        className="items-center gap-3 bg-white dark:bg-darklight p-2 rounded-lg w-max mx-auto mb-4"
                        hidden={!activeSong}
                    >
                        <button
                            onClick={() =>
                                window.open(
                                    `${WEB_API_URL}/one80jam/${activeSong?.slug}`,
                                    "_blank",
                                )
                            }
                            className="text-sm text-blue-500 underline inline-block p-4 dark:bg-darklight px-2 py-1 rounded-lg"
                        >
                            Open in New Tab
                        </button>
                    </div>
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
