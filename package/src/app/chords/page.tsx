'use client';
import React from 'react';

export default function Chords() {
  const [selectedCategory, setSelectedCategory] = React.useState<'fast' | 'slow'>('fast');

  const handleCategoryChange = (category: 'fast' | 'slow') => {
    setSelectedCategory(category);
  };


  return (
    <section>
      <div className='container pt-32 text-center'>
        <h1 className='text-4xl font-bold mb-8'>Praise & Worship</h1>
        <p className='text-lg pb-10 mx-auto max-w-2xl'>
          More than 500+ songs and we're adding more. Search the title or lyrics of the song and transpose to your preferred key notes down below.
        </p>
        <div className='mb-8'>
          <div className='flex justify-center'>
            <div className='bg-secondary dark:bg-darklight flex p-2 rounded-lg'>
              <button
                className={`text-xl font-medium cursor-pointer py-2 px-8 sm:py-4 sm:px-16 ${
                  selectedCategory === 'fast'
                    ? 'text-primary bg-white dark:bg-darkmode rounded-lg shadow dark:shadow-neutral-50/20'
                    : 'text-black dark:text-white'
                }`}
                onClick={() => handleCategoryChange('fast')}>
                Fast Songs
              </button>
              <button
                className={`text-xl font-medium cursor-pointer py-2 px-8 sm:py-4 sm:px-16 ${
                  selectedCategory === 'slow'
                    ? 'text-primary bg-white dark:bg-darkmode rounded-lg shadow dark:shadow-neutral-50/20'
                    : 'text-black dark:text-white'
                }`}
                onClick={() => handleCategoryChange('slow')}>
                Slow Songs
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
}
