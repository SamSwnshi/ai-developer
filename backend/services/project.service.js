import mongoose from "mongoose";
import projectModel from "../models/project.models.js";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is Required!");
  }
  if (!userId) {
    throw new Error("UserID is Required!");
  }

  let project ;
  try{

    
     project = await projectModel.create({
      name,
      users: [userId],
    });
  }catch(error){
    if(error.code === 11000){
      throw new Error("Project name already Exist!")
    }
    throw error;
  }

  return project;
};

export const getAllProjectByUserID = async({userId})=>{
  if(!userId){
    throw new Error("UserID is Required!");
  }

  const allUserProject = await projectModel.find({users: userId})

  return allUserProject;
}
