import esbuild from "esbuild";

import { conf } from "./toolchain/conf.mjs";

const { dist_path } = conf;

const mservices_list = ["events", "users"];

const { watch } = Opts({ watch: false });

for (const mservice_id of mservices_list) {
  esbuild
    .build({
      entryPoints: [`vanilla/src/${mservice_id}.svc/${mservice_id}.index.js`],
      bundle: true,
      platform: "node",
      outfile: dist_path + "/app/" + mservice_id + ".js",
      watch,
    })
    .catch(() => process.exit(1));
}

function Opts(opts_default = {}) {
  const provided_opts = process.argv
    .filter((opt) => opt.startsWith("--"))
    .map((opt) => opt.slice(2))
    .reduce(function (opts, opt) {
      opts[opt] = true;
      return opts;
    }, opts_default);
  return provided_opts;
}
