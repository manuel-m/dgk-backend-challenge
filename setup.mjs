import fs from "fs";

import { conf } from "./devops/conf.mjs";

import { mserviceSetupMap } from "./devops/mservices.setup.mjs";
import { k8s } from "./devops/k8s.mjs";

const { dist_path, mservicesMap, mservices_enabled, project_root } = conf;

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
    const { port } = mservicesMap[mservice_id];
    acc[mservice_id] = { port };
    return acc;
  }, {});

  fs.writeFileSync(
    `${project_root}/app/generated/mservices_net.js`,
    `export default ${JSON.stringify(mservices_net)};`
  );
}

// k8s watch command
for (const cmd of Object.keys(k8s.sbin)) {
  fs.writeFileSync(`${dist_path}/sbin/${cmd}.sh`, k8s.sbin[cmd](conf));
}

// k8s microservices
for (const mservice_id of mservices_enabled) {
  const msetup = mserviceSetupMap[mservice_id];
  const yaml_path = `${dist_path}/k8s/${mservice_id}.yaml`;

  // mandatory yaml
  fs.writeFileSync(yaml_path, msetup.Yaml({ mservice_id, ...conf }));

  for (const hookSync of msetup.hookSyncArray || []) {
    const { content, absPath } = hookSync({ mservice_id, ...conf });
    fs.writeFileSync(absPath, content);
  }
}
