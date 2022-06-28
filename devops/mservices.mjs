import { redis } from "./redis/redis.mservice.mjs";
import { nginx } from "./nginx/nginx.mservice.mjs";
import { users } from "./users/users.mservice.mjs";

export const mservices_map = { nginx, redis, users };
