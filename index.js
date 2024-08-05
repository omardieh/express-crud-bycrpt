require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { connectDB } = require("./config/db.config");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
const userRouter = require("./routes/user.route");
app.use("/users", userRouter);

connectDB();
const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log("app is running, visit : http://localhost:" + port);
});
