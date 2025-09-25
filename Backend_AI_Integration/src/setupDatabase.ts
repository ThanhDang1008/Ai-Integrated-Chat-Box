import { Sequelize } from "sequelize";
import { config } from "@/config.app";
import Logger from "bunyan";
import { createClient, RedisClientType } from "redis";
import { Client } from "@elastic/elasticsearch";

const log: Logger = config.createLogger("setupDatabase");

const setup_sequelize = new Sequelize(
  config.DB_DATABASE!,
  config.DB_USERNAME!,
  config.DB_PASSWORD!,
  {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT,
    port: Number(config.DB_PORT),
    logging: false,
    query: {
      raw: true,
    },
    timezone: "+07:00",
  }
);

const setup_redis_client = createClient({
  password: config.REDIS_PASSWORD,
  socket: {
    host: config.REDIS_HOST,
    port: Number(config.REDIS_PORT),
  },
});

const setup_es_client = new Client({ node: config.ELASTICSEARCH_URL });

class ConnectionToDatabase {
  private sequelize: Sequelize;
  private redisClient;
  private esClient;

  constructor() {
    this.sequelize = setup_sequelize;
    this.redisClient = setup_redis_client;
    this.esClient = setup_es_client;
  }

  public async db(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log(
        `--------Connection to database ${config.DB_DIALECT}:${config.DB_DATABASE} successful!--------`
      );
      // log.info(
      //   `--------Connection to database ${config.DB_DIALECT}:${config.DB_DATABASE} successful!--------`
      // );
    } catch (error) {
      console.log("--------Unable to connect to the database--------", error);
      log.error("Unable to connect to the database:", error);
      return process.exit(1);
    }
  }

  public async redis(): Promise<void> {
    try {
      await this.redisClient.connect().catch((err) => {
        console.log("--------Connection to redis failed--------", err);
        return process.exit(1);
      });
      console.log("--------Connection to redis successful!--------");
    } catch (error) {
      console.log("--------Unable to connect to redis--------", error);
      log.error("Unable to connect to redis:", error);
      return process.exit(1);
    }
  }

  public async elasticSearch(): Promise<void> {
    try {
      await this.esClient.ping(); //true
      console.log("--------Connection to elasticsearch successful!--------");
    } catch (error) {
      console.log("--------Unable to connect to elasticsearch--------", error);
      log.error("Unable to connect to elasticsearch:", error);
      return process.exit(1);
    }
  }
}

export const connectionToDatabase: ConnectionToDatabase =
  new ConnectionToDatabase();
