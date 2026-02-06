'use client'

import { PlanType } from '@/app/types/plan'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { SetStateAction, useEffect, useState } from 'react'
import PricingSkeleton from '../../Skeleton/Pricing'

const Schedule = () => {
  const [plan, setPlan] = useState<PlanType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setPlan(data.PlanData)
      } catch (error) {
        console.error('Error fetching service', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  //
  const [selectedCategory, setSelectedCategory] = useState<
    'sunday' | 'wednesday'
  >('sunday')

  const handleCategoryChange = (
    category: SetStateAction<'sunday' | 'wednesday'>
  ) => {
    setSelectedCategory(category)
  }

  return (
    <section id='pricing' className='scroll-mt-12'>
      <div className='container'>
        <div className='text-center'>
          <h2>Church Services</h2>
          <p className='text-lg font-normal max-w-lg mx-auto my-6'>
            Explore pricing that aligns with your goals and delivers measurable
            results.
          </p>
        </div>
        {/* toggle button */}
        {/* Yearly/Monthly Toggle Buttons */}
        <div className='mb-8'>
          <div className='flex justify-center'>
            <div className='bg-qsecondary dark:bg-darklight flex p-2 rounded-lg'>
              <button
                className={`text-xl font-medium cursor-pointer py-2 px-8 sm:py-4 sm:px-16 ${
                  selectedCategory === 'sunday'
                    ? 'text-primary bg-white dark:bg-darkmode rounded-lg shadow dark:shadow-neutral-50/20'
                    : 'text-black dark:text-white'
                }`}
                onClick={() => handleCategoryChange('sunday')}>
                Every Sunday
              </button>
              <button
                className={`text-xl font-medium cursor-pointer py-2 px-8 sm:py-4 sm:px-16 ${
                  selectedCategory === 'wednesday'
                    ? 'text-primary bg-white dark:bg-darkmode dark rounded-lg shadow dark:shadow-neutral-50/20'
                    : 'text-black dark:text-white'
                }`}
                onClick={() => handleCategoryChange('wednesday')}>
                Every Wednesday
              </button>
            </div>
          </div>
        </div>
        {/* grid layout */}
        <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6'>
          {/* plans card */}
          {loading
            ? Array.from({ length: 2 }).map((_, i) => <PricingSkeleton key={i} />)
            : plan
                .filter((item) => item.day === selectedCategory) // only show plans for the selected day
                .map((item, i) => (
                  <div key={i}>
                    <div className='bg-white dark:bg-darkmode rounded-lg shadow-lg dark:shadow-neutral-50/10 border border-black/10 dark:border-white/10 px-7 py-10 h-full'>
                      <div className='flex flex-col gap-6 border-b border-black/10 dark:border-white/10 pb-6'>
                        <p className='text-2xl font-bold'>{item.type}</p>
                        <p className='text-5xl font-bold text-lightdarkblue dark:text-white'>{item.time}</p>
                        <p className='text-base font-normal'>{item.desc}</p>
                      </div>
                      {/* options */}
                      <div>
                        <ul className='flex flex-col gap-6 my-6'>
                          {item.option.map((feat, i) => (
                            <li key={i}>
                              <div className='flex items-center gap-3'>
                                <div className='p-1 rounded-full bg-primary/10 text-primary'>
                                  <Icon icon={'material-symbols:check-rounded'} width={19} height={19} />
                                </div>
                                <p className='text-base font-normal'>{feat}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
        </div>
      </div>
    </section>
  )
}

export default Schedule
