import mongoose from "mongoose";
import projectModel from "../models/project.models.js";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is Required!");
  }
  if (!userId) {
    throw new Error("UserID is Required!");
  }

  let project;
  try {
    project = await projectModel.create({
      name,
      users: [userId],
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Project name already Exist!");
    }
    throw error;
  }

  return project;
};

export const getAllProjectByUserID = async ({ userId }) => {
  if (!userId) {
    throw new Error("UserID is Required!");
  }

  const allUserProject = await projectModel.find({ users: userId });

  return allUserProject;
};
export const addUsersToProject = async ({ projectId, users ,userId}) => {
  if (!projectId) {
    throw new Error("ProjectID is Required!");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid ProjectID");
  }

  if (!users) {
    throw new Error("Users is Required!");
  }

  if (
    !Array.isArray(users) ||
    users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid userId(s) in users array");
  }
  if (!userId) {
    throw new Error("UserID is Required!");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const project = await projectModel.findOne({
    _id: projectId,
    users: userId
  })

  console.log(project);

  if(!project){
    throw new Error("Users not belong to this Project!")
  }

  const updateProject = await projectModel.findOneAndUpdate({
    _id: projectId,
  },{
    $addToSet: {
      users: {
        $each: users
      }
    }
  },{
    new: true
  })

  return updateProject;

};
