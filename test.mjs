import { spawn } from "child_process";

import { conf } from "./devops/conf.mjs";

_main();

async function _main() {
  const { dist_path } = conf;
  await node_run(dist_path + "/tests/e2e.test.js");
}

function node_run(command) {
  return new Promise(function (resolve) {
    const child = spawn("node", [command]);

    child.stdout.on("data", (mess) => console.log(`${mess}`.slice(0, -1)));
    child.stderr.on("data", (mess) => console.error(`${mess}`.slice(0, -1)));

    child.on("close", function (code) {
      if (code !== 0) console.log(`child process exited with code ${code}`);
      resolve(code);
    });
  });
}
