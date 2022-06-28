import fs from "fs";
import dotenv from "dotenv";
import { mservices_map } from "./devops/mservices.mjs";
import { k8s } from "./devops/k8s.mjs";

dotenv.config();
const { deploy } = process.env;
const deploys = JSON.parse(fs.readFileSync("./conf/deploys.json"));
const mservices = JSON.parse(fs.readFileSync("./conf/mservices.json"));
const mservices_enabled = deploys[deploy].mservices;

const conf = {
  deploy,
  deploys,
  dist_path: `${process.cwd()}/dist/${deploy}`,
  mservices,
  mservices_enabled,
};

if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

const deploy_dir = `dist/${deploy}`;

if (fs.existsSync(deploy_dir) === true) {
  fs.rmSync(deploy_dir, { recursive: true });
}

fs.mkdirSync(deploy_dir + "/sbin", { recursive: true });

// k8s watch command
for (const cmd of Object.keys(k8s.sbin)) {
  fs.writeFileSync(`${deploy_dir}/sbin/${cmd}.sh`, k8s.sbin[cmd](conf));
}

// k8s microservices yaml
for (const mservice_id of mservices_enabled) {
  const mservice = mservices_map[mservice_id];
  const yaml_path = `${deploy_dir}/${mservice_id}.yaml`;
  fs.writeFileSync(yaml_path, mservice.Yaml({ mservice_id, ...conf }));
}
