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
