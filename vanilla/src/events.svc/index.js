import { appConf } from "../appConf";

import express from "express";

const svc_name = "events";
const { svc } = appConf({ svc_name });

const { port } = svc[svc_name];

const app = express();

app.get("/", function (req, res) {
  res.send(svc_name + '!!!');
});

app.listen(port, 'localhost', () => {
  console.log("listening on :" + port);
});
