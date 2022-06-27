import fs from "fs";
import esbuild from "esbuild";

const svc_list = ["events", "users"];

const { watch } = Opts({ watch: false });

if (watch === false) {
  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
  }
  for (const f of [".env", "conf.json"]) {
    fs.copyFileSync("../" + f, "dist/" + f);
  }
}

for (const svc_name of svc_list) {
  esbuild
    .build({
      entryPoints: ["src/" + svc_name + ".svc/index.js"],
      bundle: true,
      platform: "node",
      outfile: "dist/" + svc_name + ".js",
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
