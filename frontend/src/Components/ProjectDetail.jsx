/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext, useRef } from 'react'
import { data, useLocation } from 'react-router-dom'
import axios from "../config/axios";
import { initializeSocket, recieveMessage, sendMessage } from '../config/socket';
import { UserContext } from "../context/user.context";
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer';


function SyntaxHighlightedCode(props) {
    const ref = useRef(null)
    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [props.className, props.children])
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
    const [openFiles, setOpenFiles] = useState([])
    const [fileTree, setFileTree] = useState({})
    const [currentFile, setCurrentFile] = useState(null)
    const { user } = useContext(UserContext);
    const [webContainer, setWebContainer] = useState(null)

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

        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log("Container Started!")
            })
        }

        recieveMessage("project-message", data => {
            const message = JSON.parse(data.message);
            console.log(message)

            webContainer.mount(message.fileTree)

            if (message.fileTree) {
                setFileTree(message.fileTree)
            }
            setMessages(prevMessages => [...prevMessages, data])
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

    const scrollToBottom = () => {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    const WriteAiMessage = () => {
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

            <section className="right bg-red-50 flex-grow h-full flex ">
                <div className="explore h-full flex max-w-64">
                    <div className="file-tree">
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([...new Set([...openFiles, file])])
                                    }}
                                    className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full">
                                    <p
                                        className='font-semibold text-lg'
                                    >{file}</p>
                                </button>))
                        }
                    </div>
                </div>
                <div className="code-editor">
                    <div className="top flex justify-between w-full">
                        <div className="files flex">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                                        <p
                                            className='font-semibold text-lg'
                                        >{file}</p>
                                    </button>
                                ))
                            }
                        </div>

                        <div className="actions flex gap-2">
                            <button onClick={async()=>{
                                await webContainer.mount(fileTree);
                                const installProcess= await webContainer?.spawn('ls')
                                installProcess.output.pipeTo(new WritableStream({
                                    write(chunk) {
                                        console.log(chunk)
                                    }
                                }))
                            }}>ls</button>
                        </div>
                    </div>
                    <div className="bottom">
                        {
                            fileTree[currentFile] && (
                                <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                                    <pre
                                        className="hljs h-full">
                                        <code
                                            className="hljs h-full outline-none"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText;
                                                const ft = {
                                                    ...fileTree,
                                                    [currentFile]: {
                                                        file: {
                                                            contents: updatedContent
                                                        }
                                                    }
                                                }
                                                setFileTree(ft)
                                                saveFileTree(ft)
                                            }}
                                            dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                paddingBottom: '25rem',
                                                counterSet: 'line-numbering',
                                            }}
                                        />
                                    </pre>
                                </div>
                            )
                        }
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
