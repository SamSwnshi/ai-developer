/* eslint-disable no-unused-vars */
import React from 'react';
import { Route,BrowserRouter,Routes } from 'react-router-dom';
import Login from '../Components/Login';
import Home from '../Components/Home';
import Register from '../Components/Register';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
