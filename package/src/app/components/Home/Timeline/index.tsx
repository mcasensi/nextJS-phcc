'use client'

import { CategoryType } from '@/app/types/category'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CategorySkeleton from '../../Skeleton/Category'

const Timeline = () => {
  const [category, setCategory] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setCategory(data.CategoryData)
      } catch (error) {
        console.error('Error fetching service', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section id='timeline' className='scroll-mt-12'>
      <div className='container'>
        <div className='text-center'>
          <h2>Events</h2>
          <p className='text-lg font-normal max-w-md mx-auto my-6'>
            Dive into our categories to find tailored services that drive
            results.
          </p>
        </div>
          
        <div>
          <ol className="border-s-2 border-primary dark:border-primary-500">
            <li>
              <div className="flex-start flex items-center">
                <div
                  className="-ms-[9px] -mt-2 me-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary dark:bg-primary-500"></div>
                <h4 className="-mt-2 text-xl font-semibold">Title of section 1</h4>
              </div>
              <div className="mb-6 ms-6 pb-6">
                <a
                  href="#!"
                  className="text-sm text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600">4 February, 2022</a>
                <p className="mb-4 mt-2 text-neutral-600 dark:text-neutral-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}

export default Timeline
