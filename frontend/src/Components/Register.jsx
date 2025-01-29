/* eslint-disable no-unused-vars */
import React, { useState,useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { UserContext } from "../context/user.context";
const Register = () => {

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const navigate = useNavigate();
      const { setUser } = useContext(UserContext);

    const submitHandler = (e) =>{
      e.preventDefault()
      axios.post('/users/register',{
        email,password
      }).then((res)=>{
        console.log(res.data)
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/")
      }).catch((error)=>{
        console.log(error.response.data)
      })
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-black-900 text-white tracking-wider">
      <div className="w-full max-w-md p-8 space-y-6 bg-lime-900 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <form className="space-y-4" onSubmit={submitHandler}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
            onChange={(e)=> setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
            onChange={(e)=> setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-black rounded-lg hover:bg-white hover:text-black focus:ring-2 focus:ring-blue-500 transition duration-150"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-black hover:underline hover:text-white font-bold transition duration-150">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
