import esbuild from "esbuild";

import { conf } from "./devops/conf.mjs";

const { dist_path } = conf;

const { watch } = Opts({ watch: false });

const { mservicesMap } = conf;

const nodeBackendArray = Object.keys(mservicesMap).filter(function (id) {
  return mservicesMap[id].build === "nodeBackend";
});

for (const mservice_id of nodeBackendArray) {
  esbuild
    .build({
      entryPoints: [`app/src/${mservice_id}.svc/${mservice_id}.index.js`],
      bundle: true,
      platform: "node",
      outfile: dist_path + "/app/" + mservice_id + ".js",
      watch,
    })
    .catch(() => process.exit(1));
}

esbuild
  .build({
    entryPoints: ["tests/src/e2e.tests.index.js"],
    bundle: true,
    platform: "node",
    outfile: dist_path + "/tests/e2e.test.js",
    watch,
  })
  .catch(() => process.exit(1));

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
