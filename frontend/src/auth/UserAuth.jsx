/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/user.context';
import { useNavigate } from 'react-router-dom';

const UserAuth = ({ children }) => {
    const { user } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token")

    const navigate = useNavigate()

  
    useEffect(() => {
        if (!token) {
            navigate('/login')
        }

        if (!user) {
            navigate('/login')
        }
    }, [])

    // if (loading) {
    //     return <div className='text-white'>Loading...</div>
    // }
    return (
        <>
            {children}
        </>
    )
}

export default UserAuth
