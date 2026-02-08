'use client'
import React, { useMemo } from 'react';
import { useState, useEffect, use } from 'react';
interface FastSong {
  id: number; // Unique identifier for the product
  name: string; // Category of the product
  webViewLink: string; 
}
export default function Chords() {
    const [value, setValue] = useState('');
    const [allSongs, setAllSongs] = useState<FastSong[]>([]);
    const [selectedCategory, setSelectedCategory] = React.useState<'fast' | 'slow'>('fast');
   const [currentPage, setCurrentPage] = useState(1);
   const handleCategoryChange = (category: 'fast' | 'slow') => {
      setSelectedCategory(category);
      fetchSongs(category);
      setActiveSong(null);
      setValue('');
   };
   const [activeSong, setActiveSong] = useState<FastSong | null>(null);
   const [isChecked, setIsChecked] = useState(true);
   
  const itemsPerPage = 3;

  /* Filter first */
  const filteredSongs = useMemo(() => {
    return value
      ? allSongs.filter(song =>
          song.name.toLowerCase().includes(value.toLowerCase())
        )
      : allSongs;
  }, [allSongs, value]);
  /* Pagination must use filtered list */
  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

   const paginatedSongs = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredSongs.slice(startIndex, startIndex + itemsPerPage);
   }, [filteredSongs, currentPage]);

   const fetchSongs = async (category: 'fast' | 'slow') => {
      const fastUrl = "http://localhost:8000/drive/1GCFbznF2sIy08wZ7dzYPCjkLBEKXXz7d"
      const slowUrl = "http://localhost:8000/drive/1s9CF8aRlfAUeoYC9XPy58B_T4dTRSVRM"
      try {
         const response = await fetch(category === 'fast' ? fastUrl : slowUrl);
         const data = await response.json();
         setAllSongs(data);
      } catch (error) {
         console.error('Error fetching songs:', error);
      }
   };

   useEffect(() => {
      fetchSongs(selectedCategory);
   }, [selectedCategory]);

  return (
     <section className="bg-stone-900 mx-auto lg:p-10 sm:p-4 md:p-10 text-white xl:mt-30 lg:mt-20 md:mt-20 mt-20">
         <div className="bg-stone-900 mx-auto lg:p-5 sm:p-4 md:p-5 text-white">
            <div className="p-4">
               <h1 className="text-center font-bold text-white text-4xl">Praise & Worship</h1>
               <p className="mx-auto font-normal text-center my-6 max-w-lg text-white">
                     Search the title or lyrics of the song. Find chords and lyrics for your favorite praise and worship songs.
               </p>
               <div className="grid justify-items-center">
                     <div className="bg-white rounded-lg overflow-hidden px-2 py-2 xl:w-1/2 lg:w-1/2 md:w-1/2 w-full">
                        <input className="text-stone-400 outline-none" onChange={(event) => setValue(event.target.value)} value={value} type="text" placeholder="Search Title of the Song" />
                     </div>
               </div>
            </div>
            <div className='mb-8'>
               <div className='flex justify-center'>
                  <div className='bg-secondary dark:bg-darklight flex p-2 rounded-lg'>
                  <button
                        className={`text-xl font-medium cursor-pointer py-2 px-8 sm:py-4 sm:px-16 ${
                        selectedCategory === 'fast'
                           ? 'text-primary bg-white dark:bg-darkmode rounded-lg shadow dark:shadow-neutral-50/20'
                           : 'text-black'
                        }`}
                        onClick={() => handleCategoryChange('fast')}>
                        Fast Songs
                  </button>
                  <button
                        className={`text-xl font-medium cursor-pointer py-2 px-8 sm:py-4 sm:px-16 ${
                        selectedCategory === 'slow'
                           ? 'text-primary bg-white dark:bg-darkmode rounded-lg shadow dark:shadow-neutral-50/20'
                           : 'text-black'
                        }`}
                        onClick={() => handleCategoryChange('slow')}>
                        Slow Songs
                  </button>
                  </div>
               </div>
            </div>
        </div>
        <div>
          <div
            className="border border-gray-300 shadow-sm rounded-lg overflow-hidden max-w-sm mx-auto"
            hidden={value.length > 0 ? false : true}
            >
               {/* Scroll container */}
               <div className="max-h-40 overflow-y-auto"> {/* adjust height as needed */}
                  <table className="w-full text-sm leading-5">
                     <thead className="bg-gray-100 sticky top-0 z-10">
                     <tr>
                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                           Total {filteredSongs.length} Found
                        </th>
                     </tr>
                     </thead>

                     <tbody>
                     {value.length > 0 &&
                        filteredSongs.map((song) => (
                           <tr
                           key={song.id}
                           className={`cursor-pointer ${
                              activeSong?.id === song.id ? "bg-blue-900" : "hover:bg-gray-700"
                           }`}
                           onClick={() => setActiveSong(song)}
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

           <div className="justify-center mt-4" hidden={value.length > 0 ? false : true}>
              <div className="items-center gap-3 bg-white dark:bg-darklight p-2 rounded-lg w-max mx-auto mb-4" hidden={!activeSong}>
                 <div>
                     <input type="checkbox" id="chordsToggle" checked={isChecked} onChange={() => setIsChecked(!isChecked)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                     <label htmlFor="chordsToggle" className="text-large text-gray-700 pl-2 inline-block">Show Chords</label>
                 </div>
              </div>
               <div className="items-center gap-3 bg-white dark:bg-darklight p-2 rounded-lg w-max mx-auto mb-4" hidden={!activeSong}>
                  <button onClick={() => window.open(activeSong?.webViewLink, '_blank')} className="text-sm text-blue-500 underline inline-block p-4 dark:bg-darklight px-2 py-1 rounded-lg">
                     Open in Google Docs
                  </button>
              </div>
                 
               <div className="flex justify-center px-2" hidden={!activeSong}>
                  <div className="w-full max-w-5xl">
                     <iframe
                        hidden={!activeSong}
                        src={`http://localhost:8000/drive/preview-html/${activeSong?.id}?chords=${isChecked}`}
                        className="
                        w-full
                        h-[70vh]
                        sm:h-[75vh]
                        md:h-[80vh]
                        lg:h-[85vh]
                        rounded-lg
                        border border-gray-200 dark:border-gray-800
                        "
                        loading="lazy"
                     />
                  </div>
               </div>
            </div>
        </div>
      </section>
  );
  
}
