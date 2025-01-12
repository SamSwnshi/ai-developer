/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios"

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModal, setIsModal] = useState(false);
  const [projectName, setProjectName] = useState(null);

  const createProject = (e) => {
    e.preventDefault();
    console.log({projectName});

    axios.post("/projects/create",{
      name:projectName,
    }).then((res)=>{
      console.log(res.data);
    }).catch((error)=>{
      console.log(error);
    })

    
  };
  return (
    <main className="p-4 text-white">
      <div className="projects">
        <button
          className="project p-4 rounded-md border border-red-600"
          onClick={() => setIsModal(true)}
        >New Project
          <i className="ml-2 ri-links-line "></i>
        </button>
        {isModal && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md text-black w-1/3 ">
              <h2 className="text-xl mb-4">Create New Project</h2>
              <form onSubmit={createProject}>
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    onChange={(e) => setProjectName(e.target.value)}
                    value={projectName}
                    type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="flex justify-between">
                  <button className="px-7 py-2 border border-gray-500 rounded-md hover:bg-red-500 hover:text-white" type="button">Cancel</button>
                  <button className="px-7 py-2 border border-gray-500 rounded-md hover:bg-red-500 hover:text-white" type="submit">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
