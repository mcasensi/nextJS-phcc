'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import PastorsForm from './grandDaughterForm'
import DaughterForm from './daughterForm'
import GrandDaughterForm from './grandDaughterForm'

export default function Directory() {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    address: '',
    Message: '',
    photo: '',
    pastor_full_name: '',
    wife_full_name: '',
    pastor_contact_number: '',
    mother_church_city: '',
    role: '',
  })
  const [showThanks, setShowThanks] = useState(false)
  const [loader, setLoader] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    const isValid = Object.values(formData).every(
      (value) => value.trim() !== ''
    )
    setIsFormValid(isValid)
  }, [formData])
  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }
  const reset = () => {
    formData.full_name = ''
    formData.mobile = ''
    formData.address = ''
    formData.Message = ''
  }

  const addDaughterPastormForm = () => {
    setDaughterFormsList((prev) => [...(prev || []), {}])
  }

  const addGrandDaughterForm = () => {
    setGrandDaughterFormsList((prev) => [...(prev || []), {}])
  }

  const [daughterFormsList, setDaughterFormsList] = useState<Record<string, any>[]>([])
  const [grandDaughterFormsList, setGrandDaughterFormsList] = useState<Record<string, any>[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoader(true)

    console.log(
      'Main Form Data:',
      formData,
      'Daughter Forms Data:',
      daughterFormsList
    );

   
  }


  return (
    <section id='contact' className='scroll-mt-12. pt-42'>
      <div className='container'>
        <div className=''>
          <h2 className='mb-9 text-center'>Delegates Registration May 2026</h2>
          <label className='text-center mb-4 block text-lg font-medium text-gray-900 dark:text-white mb-10'>
            Please fill out the form below to register as a delegate for the upcoming event. We look forward to welcoming you for this coming conference
          </label>
          <div className='relative border px-6 py-2 rounded-lg border-black/20 dark:border-white/20'>
            <form
              onSubmit={handleSubmit}
              className='flex flex-wrap w-full m-auto justify-between'>
              <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='lname'
                    className='pb-3 inline-block text-base'>
                    Pastor's Full Name <span className='text-sm text-gray-500'>(First Name Last Name)</span>
                  </label>
                  <input
                    type='text'
                    name='pastor_full_name'
                    value={formData.pastor_full_name}
                    onChange={handleChange}
                    className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  />
                </div>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='lname'
                    className='pb-3 inline-block text-base'>
                    Pastor's Age <span className='text-sm text-gray-500'>(First Name Last Name)</span>
                  </label>
                  <input
                    type='text'
                    name='pastor_age'
                    value={formData.pastor_age}
                    onChange={handleChange}
                    className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  />
                </div>
              </div>
              <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='lname'
                    className='pb-3 inline-block text-base'>
                    Pastor's Contact Number
                  </label>
                  <input
                    type='text'
                    placeholder='+639XXXXX'
                    name='pastor_contact_number'
                    value={formData.pastor_contact_number}
                    onChange={handleChange}
                    className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  />
                </div>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='lname'
                    className='pb-3 inline-block text-base'>
                     Sponsored or Non-sponsored <span className='text-sm text-gray-500'>(*Note: For Sponsored-limited to 5 delegates)</span>
                  </label>
                  <select
                    name='role'
                    value={formData.role}
                    onChange={handleChange}
                    className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  >
                    <option value="">Select Role</option>
                    <option value="Pastor">Pastor</option>
                    <option value="Assistant Pastor">Assistant Pastor</option>
                    <option value="Evangelist">Evangelist</option>
                  </select>
                </div>
              </div>
              <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='lname'
                    className='pb-3 inline-block text-base'>
                    Address <span className='text-sm text-gray-500'>(Church Address)</span>
                  </label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  />
                </div>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='lname'
                    className='pb-3 inline-block text-base'>
                    Mother Church City
                  </label>
                  <input
                    type='text'
                    name='mother_church_city'
                    value={formData.mother_church_city}
                    onChange={handleChange}
                    className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  />
                </div>
              </div>
              <div className='container justify-center mt-10'>
                <div className='flex gap-6 w-full flex-wrap justify-center'>
                  <div className='justify-center flex'>
                    <button
                      className='bg-blue-900 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded'
                      onClick={addDaughterPastormForm}
                    >
                      Add Attendees
                    </button>
                  </div>
                </div>
              </div>
             
             
              <div className='mx-0 my-2.5 w-full'>
                <button
                  type='submit'
                  
                  className={`border leading-none px-6 text-lg font-medium py-4 rounded-lg 
                    ${
                      !isFormValid || loader
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary border-primary text-white hover:bg-transparent hover:text-primary cursor-pointer'
                    }`}>
                  Submit
                </button>
              </div>
            </form>
          </div>
          {showThanks && (
            <div className='text-white bg-primary rounded-full px-4 text-lg mb-4.5 mt-1 absolute flex items-center gap-2'>
              Thank you for contacting us! We will get back to you soon.
              <div className='w-3 h-3 rounded-full animate-spin border-2 border-solid border-white border-t-transparent'></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
  
}
