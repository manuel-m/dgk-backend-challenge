import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export function appConf(opt) {
  return Object.assign(
    opt,
    JSON.parse(fs.readFileSync("conf.json").toString()),
    {
      secret1: process.env.secret1,
    }
  );
}
