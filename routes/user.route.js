const userRouter = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

userRouter.get("/", async (req, res) => {
  try {
    const foundUsers = await User.find();
    res.json(foundUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error, please contact support");
  }
});

userRouter.post("/signup", async (req, res) => {
  if (!req.body?.username || !req.body?.email || !req.body?.password) {
    res.status(401).send("all input fields are required");
    return;
  }
  const { username, email, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error, please contact support");
  }
});

userRouter.post("/login", async (req, res) => {
  if (!req.body?.email || !req.body?.password) {
    res.status(401).send("all input fields are required");
    return;
  }
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(404).send("user not found");
      return;
    }
    const passwordMatch = bcrypt.compareSync(password, foundUser.password);
    if (!passwordMatch) {
      res.status(401).send("password mismatch");
      return;
    }

    res.send("you are logged in");
  } catch (error) {
    console.error(error);
    res.status(500).send("server error, please contact support");
  }
});

module.exports = userRouter;
