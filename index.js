const express = require("express");
require("dotenv").config();
const api = require("./api");

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("API running")
})
app.use("/api", api)


app.listen(port, () => {
  console.log('====================================');
  console.log(`SERVER RUNNING ON PORT: ${port}`);
  console.log('====================================');
});