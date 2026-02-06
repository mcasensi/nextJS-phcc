'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <div className='fixed bottom-8 right-8 z-999'>
      <div className='flex items-center gap-2.5'>
        <Link
          href="https://www.youtube.com/@ThePottersHouseMandaluyong"
          target='_blank'
          className='bg-red-800 text-white hover:bg-red/15 hover:text-primary text-sm font-medium px-4 py-2.5 leading-none rounded-lg text-nowrap'>
         <div className="flex flex-wrap items-center justify-between">
          <span className="flex p-2 bg-red-800 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
            WATCH LIVE
            </div>
        </Link>
        {isVisible && (
          <div
            onClick={scrollToTop}
            aria-label='scroll to top'
            className='back-to-top flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-primary text-white shadow-md transition duration-300 ease-in-out hover:bg-dark'>
            <span className='mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white'></span>
          </div>
        )}
      </div>
    </div>
  )
}
