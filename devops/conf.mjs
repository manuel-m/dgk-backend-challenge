import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const dotenvRequiredKeys = [
  "ad_user",
  "ad_password",
  "deploy",
  "pi_user",
  "pi_password",
];

const deploys = JSON.parse(fs.readFileSync("./conf/deploys.json"));
const mservicesMap = JSON.parse(fs.readFileSync("./conf/mservices.json"));

const project_root = process.cwd();

const conf = {
  deploys,
  project_root,
  mservicesMap,
};

for (const k of dotenvRequiredKeys) {
  if (k in process.env === false) {
    throw new Error(`Expected ${k} in .env`);
  }
  conf[k] = process.env[k];
}

conf.mservices_enabled = deploys[conf.deploy].mservices;
conf.dist_path = `${project_root}/dist/${conf.deploy}`;

export { conf };
