require("dotenv").config();
import { createClient, SetOptions } from "redis";

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on("error", (err) => {
  console.log("Redis Error", err);
});

const connectToRedis = async () => {
  await client.connect().catch((err) => {
    console.log("--------Connection to redis failed--------", err);
    return process.exit(1);
  });
  return console.log("--------Connection to redis successful!--------");
};

const checkCacheRedis = async (key: string) => {
  try {
    const data = await client.get(key);
    return data;
  } catch (err) {
    console.log("error check cache: ", err);
  }
};

const getCacheRedis = async (
  key: string | Buffer
): Promise<{
  data: string | null;
  ttl: number;
}> => {
  try {
    const data = await client.get(key);
    //console.log("data: ", data);
    const ttl = await client.ttl(key);
    //console.log("ttl: ", ttl);
    //TTL The command returns -2 if the key does not exist.
    //TTL The command returns -1 if the key exists but has no associated expire.
    return {
      data: data,
      ttl: ttl,
    };
  } catch (err) {
    console.log("Error check cache: ", err);
    return {
      data: null,
      ttl: -2,
    };
  }
};

const setCacheRedis = async (
  key: string | Buffer,
  value: string | Buffer | number,
  options: SetOptions
): Promise<boolean> => {
  try {
    await client.set(key, value, options);
    return true;
  } catch (err) {
    console.log("Error set cache: ", err);
    return false;
  }
};

const deleteCacheRedis = async (key: string) => {
  try {
    await client.del(key);
  } catch (err) {
    console.log("Delete Cache Redis Error: ", err);
  }
};

export { setCacheRedis, checkCacheRedis, deleteCacheRedis, getCacheRedis };

export default connectToRedis;
