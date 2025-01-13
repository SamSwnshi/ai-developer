/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const ProjectDetail = () => {
    const [isSide, setIsSide] = useState(false);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [selectedUserId,setSelectedUserId] = useState(null);
    const users = [
        {id: 1,name: "User One"},
        {id: 2,name: "User Two"},
        {id: 3,name: "User Three"},
        {id: 4,name: "User Four"},
    ]
    const location = useLocation()
    console.log(location.state)

    const handleUserClick = (id) =>{
        setSelectedUserId([...selectedUserId,id])
        setIsModalOpen(false)
    }

    return (
        <main className='h-screen w-screen flex'>
            <section className="left flex flex-col h-full min-w-96 bg-red-500 relative">
                <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-400'>

                    <button className='flex  gap-2'>
                        <i className="ri-add-large-line mr-1"></i>
                        <p>Add Collaborator</p>
                    </button>
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
                        <input className="p-3 px-4 border-none outline-none flex-grow" type="text" placeholder='Enter text here' />
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div key={user.id} className={`user cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""} p-2 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            ))}
                        </div>
                        <button
                            // onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default ProjectDetail
