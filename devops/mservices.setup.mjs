import { consents } from "./consents/consents.mservice.setup.mjs";
import { mongopi } from "./mongopi/mongopi.mservice.setup.mjs";
import { nginx } from "./nginx/nginx.mservice.setup.mjs";
import { redis } from "./redis/redis.mservice.mjs";
import { users } from "./users/users.mservice.setup.mjs";

export const mserviceSetupMap = { consents, mongopi, nginx, redis, users };
