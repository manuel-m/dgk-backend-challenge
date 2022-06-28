import fs from "fs";

import { conf } from "./toolchain/conf.mjs";

import { mservices_map } from "./devops/mservices.mjs";
import { k8s } from "./devops/k8s.mjs";

if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

const { dist_path, mservices_enabled, project_root } = conf;

fs.copyFileSync(project_root + "/.env", dist_path + "/.env");

if (fs.existsSync(dist_path) === true) {
  fs.rmSync(dist_path, { recursive: true });
}

for (const subdir of ["app", "k8s", "sbin"]) {
  fs.mkdirSync(dist_path + "/" + subdir, { recursive: true });
}

// k8s watch command
for (const cmd of Object.keys(k8s.sbin)) {
  fs.writeFileSync(`${dist_path}/sbin/${cmd}.sh`, k8s.sbin[cmd](conf));
}

// k8s microservices yaml
for (const mservice_id of mservices_enabled) {
  const mservice = mservices_map[mservice_id];
  const yaml_path = `${dist_path}/k8s/${mservice_id}.yaml`;
  fs.writeFileSync(yaml_path, mservice.Yaml({ mservice_id, ...conf }));
}
