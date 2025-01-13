/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const ProjectDetail = () => {
    const [isSide, setIsSide] = useState(false)
    const location = useLocation()
    console.log(location.state)
    return (
        <main className='h-screen w-screen flex'>
            <section className="left flex flex-col h-full min-w-96 bg-red-500 relative">
                <header className='flex justify-between p-2 px-4 w-full bg-slate-400'>
                    <button className='p-2' onClick={() => setIsSide(!isSide)}>
                        <i className="ri-group-line"></i>
                    </button>
                </header>

                <div className='conversation flex-grow flex flex-col p-1'>
                    <div className="message  flex-grow flex flex-col gap-2">
                        <div className="incoming max-w-60 flex flex-col gap-1 p-2 bg-red-800 w-fit rounded-md">
                            <small className='opactiy-65 text-sm'>example@gmail.com</small>
                            <p className='text-sm'> Lorem ipsum dolor sit amet.</p>
                        </div>
                        <div className="ml-auto max-w-60 incoming flex flex-col gap-1 p-2 bg-red-800 w-fit rounded-md">
                            <small className='opactiy-65 text-sm'>example@gmail.com</small>
                            <p className='text-sm'> Lorem ipsum dolor sit amet.</p>
                        </div>
                    </div>
                    <div className='w-full flex'>
                        <input className="p-3 px-4 border-none outline-none" type="text" placeholder='Enter text here' />
                        <button className='flex-grow'>
                            <i className="ri-send-plane-line"></i>
                        </button>
                    </div>
                </div>

                <div className={`sidepanel w-full h-full flex flex-col gap-2  bg-blue-700  absolute  top-0 transition-all ${isSide ? 'translate-x-0' : '-translate-x-full'}`}>
                    <header className='flex justify-end p-3 px-4 bg-gray-600'>
                        <button onClick={() => setIsSide(!isSide)}>
                            <i className="ri-xrp-line"></i>
                        </button>
                    </header>

                    <div className="users cursor-pointer flex flex-col gap-2">
                        <div className="chat flex items-center gap-2">
                            <img src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg" alt="" className='rounded-full w-14 h-14 p-2' />
                            <h1 className='font-semibold'>User Name</h1>
                        </div>
                    </div>
                </div>

            </section>

        </main>
    )
}

export default ProjectDetail
