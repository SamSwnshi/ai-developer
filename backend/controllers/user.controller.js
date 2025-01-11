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
    delete user._doc.password;
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
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({
        errors: "Invalid Credentials",
      });
    }

    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        errors: "Invalid Credentials",
      });
    }

    delete user._doc.password;

    const token = await user.generateJWT();

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const profileController = async (req, res) => {
  console.log(req.user);

  res.status(200).json({
    user: req.user,
  });
};

export const logoutController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    redisClient.set(token, "logout", "EX", 60 * 60 * 24);

    res.status(200).json({
      message: "Logged out successfully",
    })
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
