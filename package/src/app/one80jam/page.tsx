'use client'
import { useState, useEffect } from 'react';
import { one80JamGenre } from '../types/one80JamGenre';
import { one80JamSong } from '../types/one80JamSong';
import { get } from 'http';

export default function One80Jam() {
    const [value, setValue] = useState('');
    const [allGenres, setAllGenres] = useState<one80JamGenre[]>([])
    const [allSong, setAllSong] = useState<one80JamSong[]>([])
    const [genreId, setGenreId] = useState<number | null>(null)
    const [activeGenre, setActiveGenre] = useState('')
    
    useEffect(() => {
        fetch('http://localhost:8000/one80jam/genres?skip=0&limit=100')
            .then(response => response.json())
            .then(data => setAllGenres(data));
    }, []);

    const getSongByGenre = (genreId: number) => {
        fetch(`http://localhost:8000/one80jam/song_genres?skip=0&limit=100&genres_id=${genreId}`)
        .then(response => response.json())
        .then(data => {
            // Handle the songs data for the selected genre
            setAllSong(data);
        });

    }

  return (
    <section className="bg-stone-900 mx-auto lg:p-10 sm:p-4 md:p-10 text-white xl:mt-30 lg:mt-20 md:mt-20 mt-20">
        <div className="p-4">
            <h1 className="text-center font-bold text-white text-4xl">one80JAM</h1>
            <p className="mx-auto font-normal text-center my-6 max-w-lg text-white">
                Search the title or lyrics of the song. Christian Version available and other genres. Ideas and themes by using tags below.
            </p>
            <div className="grid justify-items-center">
                <div className="bg-white rounded-lg overflow-hidden px-2 py-2 w-1/2">
                    <input className="text-stone-400 outline-none w-1/2" type="text" onChange={(event) => setValue(event.target.value)} value={value} placeholder="Search Title of the Song" />
                </div>
                {allGenres &&
                    <div className="flex flex-wrap justify-center items-center pt-2">
                        {allGenres.map((genre) => [
                            <div key={genre.id}>
                                <div className="p-2">
                                    <button type="button" className="py-2 px-4 bg-blue-900 text-stone-100 p-2 rounded-full leading-none flex items-center text-xs"
                                        onClick={() => {
                                            setGenreId(genre.id)
                                            setActiveGenre(genre.name)
                                            getSongByGenre(genre.id)
                                        }}
                                    >
                                        #{genre.name}
                                    </button>
                                </div>
                            </div>
                        ])}
                    </div>
                }
              </div>
            <div className="border border-gray-300 shadow-sm rounded-lg overflow-hidden max-w-sm mx-auto mt-16" hidden={!activeGenre}>
                <table className="w-full text-sm leading-5">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-4 text-left font-medium text-gray-600">Total #{activeGenre} Song: {allSong.length}  </th>
                    </tr>
                    </thead>
                    <tbody>
                    {allSong.map((song) => (
                        <tr key={song.id} className="border-t border-gray-200 bg-gray-200 hover:bg-gray-300"
                            onClick={() => window.open(`http://localhost:3000/one80jam/${song.slug}`, '_blank')}
                        >
                            <td className="py-3 px-4 text-left text-gray-800">{song.song_title}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
  );
  
}
