/* eslint-disable no-unused-vars */
import React from 'react'
import { useLocation } from 'react-router-dom'

const ProjectDetail = () => {
    const location = useLocation()
    console.log(location.state)
  return (
    <div>
      Project
    </div>
  )
}

export default ProjectDetail
