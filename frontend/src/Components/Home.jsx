/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom"

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModal, setIsModal] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [project, setProject] = useState([]);

  const navigate = useNavigate()

  const createProject = (e) => {
    e.preventDefault();
    console.log({ projectName });

    axios.post("/projects/create", {
      name: projectName,
    }).then((res) => {
      console.log(res.data);
    }).catch((error) => {
      console.log(error);
    })
  };
  useEffect(() => {
    axios.get("/projects/all")
      .then((res) => {
        // console.log(res.data)
        setProject(res.data.projects)
      })
      .catch((error) => {
        console.log({ error: error.message })
      })
  }, [])
  return (
    <main className="p-6 flex flex-col items-center text-white ">
      <div className="projects flex flex-wrap gap-4">

        <button
          className="project py-4 px-4 rounded-lg border border-red-600 hover:bg-gray-600"
          onClick={() => setIsModal(true)}
        >Create New Project
          <i className="ml-3 ri-links-line "></i>
        </button>
        {project?.map((project) => (
          <div key={project._id} onClick={() => {
            navigate(`/project`, {
              state: { project }
            })
          }} className="flex flex-col items-center gap-2 project p-2 cursor-pointer min-w-52 border border-red-600 rounded-lg hover:bg-gray-600">
            <h2 className="font-semibold uppercase tracking-wider">{project.name}</h2>
            <div className="flex gap-2">
              <p><i className="ri-user-5-line mr-2"></i>Collaboraters :</p>
              {project.users.length}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center text-center mt-48">
        <h1 className="text-8xl font-semibold tracking-wide text-white]">Welcome to BotConnect</h1>
      </div>
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

    </main>
  );
};

export default Home;
