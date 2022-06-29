import { redis } from "./redis/redis.mservice.mjs";
import { nginx } from "./nginx/nginx.mservice.setup.mjs";
import { users } from "./users/users.mservice.setup.mjs";

export const mserviceSetupMap = { nginx, redis, users };
