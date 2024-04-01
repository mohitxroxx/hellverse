const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
connectDB();


const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Server up and running");
});

app.use("/api", routes);

app.listen(process.env.PORT, () =>
  console.log(`SERVER UP and running at ${process.env.PORT}`)
);
