require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { userRouter,productRouter,orderRouter } = require("./routes");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ignoreUndefined: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
