import userModel from "../models/user.models.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createController = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  try {
    const user = await userService.createUser(req.body);

    const token = await user.generateJWT();

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const loginController = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(401).json({
        errors: "Invalid Credentials"
      })
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};
