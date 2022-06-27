import { appConf } from "../appConf";

import express from "express";

const svc_name = "users";
const { svc } = appConf({ svc_name });

const { port } = svc[svc_name];

const app = express();

app.get("/", function (req, res) {
  res.send("hello world\n");
});

app.listen(port, () => {
  console.log("users listening on :" + port);
});
