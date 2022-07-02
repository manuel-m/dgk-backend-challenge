import { consents } from "./consents/consents.mservice.setup.mjs";
import { mirror } from "./mirror/mirror.mservice.setup.mjs";
import { mongopi } from "./mongopi/mongopi.mservice.setup.mjs";
import { nginx } from "./nginx/nginx.mservice.setup.mjs";
import { postgresad } from "./postgresad/postgresad.mservice.setup.mjs";
import { postgrespi } from "./postgrespi/postgrespi.mservice.setup.mjs";
import { redis } from "./redis/redis.mservice.mjs";
import { users } from "./users/users.mservice.setup.mjs";

export const mserviceSetupMap = {
  consents,
  mirror,
  mongopi,
  nginx,
  postgresad,
  postgrespi,
  redis,
  users,
};
