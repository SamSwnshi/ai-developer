import projectModel from "../models/project.models.js";
import * as  projectService from "../services/project.service.js";
import { validationResult } from "express-validator";
import userModel from "../models/user.models.js";

export const createProject = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const { name } = req.body;
    const loggedIn = await userModel.findOne({ email:req.user.email });

    const userId = loggedIn._id;
    const newProject = await projectService.createProject({ name, userId });

    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const getAllProject = async(req,res) =>{
  try {
    const loggedInUser = await userModel.findOne({
      email: req.user.email
     })
     const allUserProject = await projectService.getAllProjectByUserID({
      userId: loggedInUser._id
     }) 
     return res.status(200).json({
      projects: allUserProject
     })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
 
}

export const addUserToProject = async(req,res)=>{
  const error = validationResult(req);

  if(!error.isEmpty()){
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const {projectId,users} = req.body;

    const loggedInUser = await userModel.findOne({
      email: req.user.email
    })

    const project = await projectService.addUsersToProject({
      projectId,
      users,
      userId: loggedInUser._id
    })
    return res.status(200).json({
      project
    })

    
  } catch (error) {
    console.log(error)
    res.status(400).json({error: error.message})
  }
}

export const getProjectById = async(req,res)=>{
  const {projectId} = req.params; 
  try {
    const project = await projectService.getProjectById({projectId})
    return res.status(200).json({project})
  } catch (error) {
    console.log(error)
    res.status(400).json({error: error.message})
  }
}

export const updateFileTree = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {

      const { projectId, fileTree } = req.body;

      const project = await projectService.updateFileTree({
          projectId,
          fileTree
      })

      return res.status(200).json({
          project
      })

  } catch (err) {
      console.log(err)
      res.status(400).json({ error: err.message })
  }

}