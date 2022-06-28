import { redis } from "./redis/redis.mservice.mjs";
import { nginx } from "./nginx/nginx.mservice.mjs";

export const mservices_map = { nginx, redis };
