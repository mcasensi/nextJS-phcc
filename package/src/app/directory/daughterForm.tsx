'use client'
import React, { SetStateAction } from 'react'
import { useState, useEffect } from 'react'

export default function DaughterForm({
  headerTitle,
  index,
  daughterFormsList,
  setDaughterFormsList,
  applicationEnabled
}: {
  headerTitle: string
  index: number
  daughterFormsList?: Record<string, any>[]
  setDaughterFormsList?: React.Dispatch<React.SetStateAction<Record<string, any>[]>>
  applicationEnabled?: boolean
}) {

  const [pastorName, setPastorName] = useState('')
  const [showThanks, setShowThanks] = useState(false)
  const [loader, setLoader] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    if (daughterFormsList && daughterFormsList[index]) {
      const isValid = Object.values(daughterFormsList[index]).every(
        (value) => String(value).trim() !== ''
      )
      setIsFormValid(isValid)
    } else {
      setIsFormValid(false)
    }
  }, [daughterFormsList, index])
  const handleChange = (e: any) => {
    if (setDaughterFormsList) {
      setDaughterFormsList((prev: any) => {
        const updatedList = [...prev]
        updatedList[index] = {
          ...updatedList[index],
          [e.target.name]: e.target.value,
        }
        return updatedList
      })
    }
  }
  const reset = () => {
    if (setDaughterFormsList) {
      setDaughterFormsList((prev: any) => {
        const updatedList = [...prev]
        updatedList[index] = {
          ...updatedList[index],
          full_name: '',
          mobile: '',
          address: '',
          mother_church_city: '',
          email: '',
          birthday: '',
          wife_name: '',
          role: '',
          photo: '',
        }
        return updatedList
      })
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoader(true)

    if (!process.env.API_SHEET) {
      console.error('API_SHEET environment variable is not defined')
      setLoader(false)
      return
    }

    fetch(process.env.API_SHEET, {
      method: 'POST',
      headers: { 
        'Content-type': 'application/json',
        'X-API-KEY': process.env.API_SHEET_KEY || ''
      },
      body: JSON.stringify({
        full_name: daughterFormsList?.[index]?.full_name,
        mobile: daughterFormsList?.[index]?.mobile,
        address: daughterFormsList?.[index]?.address,
        mother_church_city: daughterFormsList?.[index]?.mother_church_city,
        email: daughterFormsList?.[index]?.email,
        birthday: daughterFormsList?.[index]?.birthday,
        wife_name: daughterFormsList?.[index]?.wife_name,
        role: daughterFormsList?.[index]?.role,
        photo: daughterFormsList?.[index]?.photo,
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

  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    if (setDaughterFormsList) {
      setDaughterFormsList((prevData) => {
        const updatedList = [...prevData];
        updatedList[index] = {
          ...updatedList[index],
          photo: 'daughter_photo.jpg', // In a real app, this would be the file name or URL of the uploaded photo
        };
        return updatedList;
      });
    }
  };

  const deleteChurchEntity = (index: number) => {
    // In a real app, this would remove the church entity from state or backend
    console.log(`Deleting church entity at index ${index}`);
    if (setDaughterFormsList) {
      setDaughterFormsList((prev: any) => {
        const updatedList = [...prev];
        updatedList.splice(index, 1); // Remove the entity at the specified index
        return updatedList;
      });
    }
  };

  return (
    <div className='container mt-10'>
      <div className='relative border px-6 py-2 rounded-lg border-black/20 dark:border-white/20'>
        <div className='grid grid-cols-2 w-full flex-row items-center justify-between mb-4'>
          <div className='align-left'><h2 className='w-full text-lg font-medium mb-4 mt-8'>{pastorName} - {headerTitle}</h2></div>
          <div className='justify-end flex items-center gap-2' hidden={!applicationEnabled}>
            <button
              className="flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-white shadow hover:bg-red-800 active:bg-red-950 transition"
              onClick={() => deleteChurchEntity(index)}
              disabled={!applicationEnabled}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
       
        
        <div className='sm:flex gap-6 w-1/4'>
          <div className='mx-0 my-2.5 flex-1'>
            <div className="flex flex-col items-center gap-4">
              {/* Avatar */}
              <div className="relative h-32 w-32">
                <img
                  src={preview || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'><rect cx='75' cy='75' width='150' height='150' fill='%23e5e7eb'/></svg>"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />

              </div>

              {/* File Input */}
              <label className="cursor-pointer rounded-lg bg-blue-900 px-4 py-2 text-white hover:bg-indigo-500 transition" hidden={!applicationEnabled}>
                Upload Pastor's Photo
                <input
                  type="file"
                  accept="image/*"
                  name='photo'
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
        <div className='sm:flex gap-6 w-full'>
          <div className='mx-0 my-2.5 flex-1'>
            <label
              htmlFor='lname'
              className='pb-3 inline-block text-base'>
              Full Name <span className='text-sm text-gray-500'>(First Name Last Name)</span>
            </label>
            <input
              type='text'
              name='full_name'
              value={daughterFormsList?.[index]?.full_name || ''}
              onChange={handleChange}
              className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500'
              disabled={!applicationEnabled}
            />
          </div>
          <div className='mx-0 my-2.5 flex-1'>
            <label
              htmlFor='lname'
              className='pb-3 inline-block text-base'>
              Wife's Full Name <span className='text-sm text-gray-500'>(First Name Last Name)</span>
            </label>
            <input
              type='text'
              name='wife_name'
              value={daughterFormsList?.[index]?.wife_name || ''}
              onChange={handleChange}
              disabled={!applicationEnabled}
              className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500'
            />
          </div>
        </div>
        <div className='sm:flex gap-6 w-full'>
          <div className='mx-0 my-2.5 flex-1'>
            <label
              htmlFor='lname'
              className='pb-3 inline-block text-base'>
              Birthday
            </label>
            <input
              type='date'
              name='birthday'
              value={daughterFormsList?.[index]?.birthday || ''}
              onChange={handleChange}
              className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500'
              disabled={!applicationEnabled}
            />
          </div>
          <div className='mx-0 my-2.5 flex-1'>
            <label
              htmlFor='lname'
              className='pb-3 inline-block text-base'>
              Email
            </label>
            <input
              type='text'
              name='email'
              value={daughterFormsList?.[index]?.email || ''}
              onChange={handleChange}
              disabled={!applicationEnabled}
              className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500'
            />
          </div>
        </div>
        <div className='sm:flex gap-6 w-full'>
          <div className='mx-0 my-2.5 flex-1'>
            <label
              htmlFor='lname'
              className='pb-3 inline-block text-base'>
              Contact Number
            </label>
            <input
              type='text'
              placeholder='+639XXXXX'
              name='mobile'
              value={daughterFormsList?.[index]?.mobile || ''}
              onChange={handleChange}
              className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500'
              disabled={!applicationEnabled}
            />
          </div>
          <div className='mx-0 my-2.5 flex-1'>
            <label
              htmlFor='lname'
              className='pb-3 inline-block text-base'>
                Role <span className='text-sm text-gray-500'>(if pastor/assistant/evangelist)</span>
            </label>
            <select
              name='role'
              value={daughterFormsList?.[index]?.role || ''}
              onChange={handleChange}
              className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500'
              disabled={!applicationEnabled}
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
              value={daughterFormsList?.[index]?.address || ''}
              onChange={handleChange}
              className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500'
              disabled={!applicationEnabled}
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
              value={daughterFormsList?.[index]?.mother_church_city || ''}
              onChange={handleChange}
              className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500'
              disabled={!applicationEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
  
}
