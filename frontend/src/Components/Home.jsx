/* eslint-disable no-unused-vars */
import React from 'react';
import { useContext } from 'react';
import { UserContext } from "../context/user.context";

const Home = () => {
  const {user} = useContext(UserContext);
  return (
    <div>
      <h2 className='text-white'>{JSON.stringify(user)}</h2>
    </div>
  )
}

export default Home
