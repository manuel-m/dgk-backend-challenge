import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const { deploy } = process.env;
const deploys = JSON.parse(fs.readFileSync("./conf/deploys.json"));
const mservicesMap = JSON.parse(fs.readFileSync("./conf/mservices.json"));
const mservices_enabled = deploys[deploy].mservices;

const project_root = process.cwd();

export const conf = {
  deploy,
  deploys,
  dist_path: `${project_root}/dist/${deploy}`,
  project_root,
  mservicesMap,
  mservices_enabled,
};
