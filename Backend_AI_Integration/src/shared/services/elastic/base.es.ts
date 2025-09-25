import Logger from "bunyan";
import { config } from "@/config.app";

import { Client } from "@elastic/elasticsearch";

export abstract class BaseElastic {
  client: Client;
  log: Logger;

  constructor(cacheName: string) {
    this.client = new Client({ node: config.ELASTICSEARCH_URL });
    this.log = config.createLogger(cacheName);
    this.esError();
  }

  private esError(): void {
    //some code here
  }
}
