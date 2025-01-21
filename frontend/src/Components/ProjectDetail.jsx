/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext, useRef } from 'react'
import { data, useLocation } from 'react-router-dom'
import axios from "../config/axios";
import { initializeSocket, recieveMessage, sendMessage } from '../config/socket';
import { UserContext } from "../context/user.context";
import Markdown from 'markdown-to-jsx';


function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}


const ProjectDetail = () => {

    const location = useLocation()
    const [isSide, setIsSide] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(new Set());
    const [users, setUsers] = useState([])
    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [fileTree,setFileTree] = useState({
        "app.js": {
            content: ""
        }

    })
    const { user } = useContext(UserContext);

    const messageBox = React.createRef()

    console.log(location.state)

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        })
        setIsModalOpen(false)
    }

    const addCollaborators = () => {
        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        })
            .then((res) => {
                console.log(res.data)
                setIsModalOpen(false)
            })
            .catch((err) => {
                console.log({ err: err.message })
            })
    }

    const sendMessageToProject = () => {

        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [...prevMessages, { sender: user, message }])

        setMessage('')
    }

    useEffect(() => {

        initializeSocket(project._id)

        recieveMessage("project-message", data => {
            console.log(data)
            appendIncomingMessage(data)
        });



        axios.get(`/projects/get-project/${location.state.project._id}`)
            .then((res) => {
                console.log({ resonse: res.data })
                setProject(res.data.project)

            })
            .catch((error) => {
                console.log({ error: error.message })
            })

        axios.get('/users/all')
            .then((res) => {
                setUsers(res.data.users)
            })
            .catch((err) => {
                console.log({ err: err.message })
            })
    }, [])

    const appendIncomingMessage = (messageObject) => {

        const messageBox = document.querySelector(".message-box")
        const message = document.createElement("div");
        message.classList.add("message", "max-w-56", "flex", "flex-center");

        if (messageObject.sender._id === "ai") {
            const markDown = (
                <Markdown>{messageObject.message}</Markdown>
            )
            message.innerHTML = `

            <small class = 'opacity-65 text-xs'>${messageObject.sender.email}</small>
            <p class='text-xs'>${markDown}</p>
            `

        } else {
            message.innerHTML = `
            <small class = 'opacity-65 text-xs'>${messageObject.sender.email}</small>
            <p class='text-xs'>${messageObject.message}</p>
            `
        }

        messageBox.current.value.appendChild(message);
        scrollToBottom()
        console.log()
    }

    const scrollToBottom = () => {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    const WriteAiMessage=() =>{
        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
            >
                <Markdown
                    // eslint-disable-next-line react/no-children-prop
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }



    return (
        <main className='h-screen w-screen flex'>
            <section className="left flex flex-col h-screen min-w-96 bg-red-500 relative">
                <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-400 absolute top-0'>

                    <button className='flex  gap-2' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-large-line mr-1"></i>
                        <p>Add Collaborator</p>
                    </button>
                    <button className='p-2' onClick={() => setIsSide(!isSide)}>
                        <i className="ri-group-line"></i>
                    </button>
                </header>

                <div className='conversation flex-grow flex flex-col p-1 pt-14 pb-10 h-full relative'>

                    <div ref={messageBox}
                        className="message-box  flex-grow flex flex-col gap-2 overflow-auto max-h-full">
                        {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                                <small className='opacity-65 text-xs'>{msg.sender.email}</small>
                                <div className='text-sm'>
                                    {msg.sender._id === 'ai' ?
                                        WriteAiMessage(msg.message)
                                        : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='w-full flex absolute bt-0'>
                        <input className="p-3 px-4 border-none outline-none flex-grow" type="text" placeholder='Enter text here' value={message}
                            onChange={(e) => setMessage(e.target.value)} />
                        <button className='flex-grow' onClick={sendMessageToProject}>
                            <i className="ri-send-plane-line"></i>
                        </button>
                    </div>
                </div>

                <div className={`sidepanel w-full h-full flex flex-col gap-2  bg-blue-700  absolute  top-0 transition-all ${isSide ? 'translate-x-0' : '-translate-x-full'}`}>
                    <header className='flex justify-between p-3 px-4 bg-gray-600'>
                        <h1 className='text-white'>Collaborators</h1>
                        <button onClick={() => setIsSide(!isSide)}>
                            <i className="ri-xrp-line"></i>
                        </button>
                    </header>

                    <div className="users cursor-pointer flex flex-col gap-2">
                        {project.users && project.users.map(user => {
                            return (
                                <div key={user._id} className="chat flex items-center gap-2">
                                    <img src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg" alt="" className='rounded-full w-14 h-14 p-2' />
                                    <h1 className='font-semibold'>{user.email}</h1>
                                </div>)

                        })}
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
                            onClick={addCollaborators}
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
