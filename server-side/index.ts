import express, { Application, Request, Response } from "express";
import fs from "fs";
import cors from "cors";
const app: Application = express();
import { PythonShell } from "python-shell";

app.use(cors());
app.use(express.json());

app.post("/python", (req, res) => {
  fs.writeFileSync(req.body.problem, req.body.code);
  let options = {
    mode: "text" as "text",
    pythonOptions: ["-u"], // get print results in real-time
    args: ["1", "2", "3"],
  };
  PythonShell.run("code.py", options).then((messages) => {
    // results is an array consisting of messages collected during execution
    console.log("results: %j", messages);
    res.json({ passOrFail: messages[0] });
  });
});

app.listen(80, () => {
  console.log("SERVER IS RUNNING");
});
