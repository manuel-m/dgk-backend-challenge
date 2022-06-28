import fs from "fs";

import { conf } from "./toolchain/conf.mjs";

import { mservices_map } from "./devops/mservices.mjs";
import { k8s } from "./devops/k8s.mjs";

const { dist_path, mservices, mservices_enabled, project_root } = conf;

if (fs.existsSync(dist_path) === true) {
  fs.rmSync(dist_path, { recursive: true });
}

for (const subdir of ["app", "k8s", "sbin"]) {
  fs.mkdirSync(dist_path + "/" + subdir, { recursive: true });
}

fs.copyFileSync(project_root + "/.env", dist_path + "/.env");

// microservices net config
{
  const mservices_net = mservices_enabled.reduce(function (acc, mservice_id) {
    const { port } = mservices[mservice_id];
    acc[mservice_id] = { port };
    return acc;
  }, {});

  fs.writeFileSync(
    `${project_root}/vanilla/generated/mservices_net.js`,
    `export default ${JSON.stringify(mservices_net)};`
  );
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
