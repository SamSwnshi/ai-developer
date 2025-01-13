/* eslint-disable no-unused-vars */
import React from 'react'
import { useLocation } from 'react-router-dom'

const ProjectDetail = () => {
    const location = useLocation()
    console.log(location.state)
    return (
        <main className='h-screen w-screen flex'>
            <section className="left flex flex-col h-full min-w-72 bg-red-500">
                <header className='flex justify-between p-2 px-4 w-full bg-slate-400'>
                    <button className='p-2 '>

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

                <div className="sidepanel"></div>

            </section>

        </main>
    )
}

export default ProjectDetail
