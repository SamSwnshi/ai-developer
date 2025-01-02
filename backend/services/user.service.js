import userModel from "../models/user.models.js";

export const createUser= async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email or Password are required!");
  }

  const hashPassword = await userModel.hashPassword(password);
  const user = await userModel.create({ email, password: hashPassword });

  return user;
};
