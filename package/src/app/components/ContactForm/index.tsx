'use client'
import React from 'react'
import { useState, useEffect } from 'react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    address: '',
    Message: '',
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoader(true)

    fetch('https://formsubmit.co/ajax/bhainirav772@gmail.com', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        Name: formData.full_name,
        PhoneNo: formData.mobile,
        Address: formData.address,
        Message: formData.Message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setShowThanks(true)
          reset()

          setTimeout(() => {
            setShowThanks(false)
          }, 5000)
        }

        reset()
      })
      .catch((error) => {
        setLoader(false)
        console.log(error.message)
      })
  }
  return (
    <section id='contact' className='scroll-mt-12'>
      <div className='container'>
        <div className='relative'>
          <h2 className='mb-9 text-center'>Open Bible Study</h2>
          <div className='relative border px-6 py-2 rounded-lg border-black/20 dark:border-white/20'>
            <form
              onSubmit={handleSubmit}
              className='flex flex-wrap w-full m-auto justify-between'>
              <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='lname'
                    className='pb-3 inline-block text-base'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    name='full_name'
                    value={formData.full_name}
                    onChange={handleChange}
                    className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  />
                </div>
                  <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='lname'
                    className='pb-3 inline-block text-base'>
                    Mobile Number
                  </label>
                  <input
                    type='text'
                    name='mobile'
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder='09xxxxxxxxx'
                    className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  />
                </div>
              </div>
              <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='Phnumber'
                    className='pb-3 inline-block text-base'>
                    Address
                  </label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    className='w-full text-base px-4 py-2.5 rounded-lg border-black/20 dark:border-white/20 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  />
                </div>
              </div>
              <div className='w-full mx-0 my-2.5 flex-1'>
                <label htmlFor='message' className='text-base inline-block'>
                  Message
                </label>
                <textarea
                  id='message'
                  name='Message'
                  value={formData.Message}
                  onChange={handleChange}
                  className='w-full mt-2 px-5 py-3 rounded-lg border-black/20 dark:border-white/20 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  placeholder='Anything else you wanna communicate'></textarea>
              </div>
              <div className='mx-0 my-2.5 w-full'>
                <button
                  type='submit'
                  disabled={!isFormValid || loader}
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
  )
}

export default ContactForm
