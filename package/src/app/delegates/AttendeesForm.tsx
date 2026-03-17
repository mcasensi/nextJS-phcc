import React, { useState } from 'react';

export default function AttendeesForm() {

    const [formData, setFormData] = useState({ name: '', age: '' });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
       <div className='w-full'>
            <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='lname'
                    className='pb-3 inline-block text-base'>
                    Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  />
                </div>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='lname'
                    className='pb-3 inline-block text-base'>
                    Age
                  </label>
                  <input
                    type='text'
                    name='age'
                    value={formData.age}
                    onChange={handleInputChange}
                    className='w-full text-base px-4 rounded-lg border-black/20 dark:border-white/20 py-2.5 border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:outline-0'
                  />
                </div>
            </div>
        </div>
    );
}