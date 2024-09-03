import { Db, MongoClient } from 'mongodb';

var db: Db;
var serverStatus: any;
export class PromController {
  cli: typeof import('prom-client');
  client: MongoClient;
  constructor(cli: typeof import('prom-client'), client: MongoClient) {
    this.cli = cli;
    this.client = client;
    return this;
  }
  async connect(collection: string): Promise<PromController> {
    await this.client.connect();
    db = this.getDb(collection);
    serverStatus = await this.getServerStatus();
    return this;
  }

  private getDb(collection : string) {
    return this.client.db(collection);
    // return this;
  }

  async getServerStatus() {
    return await db.command({ serverStatus: 1 });
  }

  getOpenConnections(): PromController {
    const openConnectionsGauge = new this.cli.Gauge({
      name: 'mongo_open_connections',
      help: 'Number of open connections to MongoDB',
    });
    openConnectionsGauge.set(serverStatus.connections.current);
    return this;
  }

  getAvailableConnections(): PromController {
    const availableConnectionsGauge = new this.cli.Gauge({
      name: 'mongo_available_connections',
      help: 'Number of available connections to MongoDB',
    });
    availableConnectionsGauge.set(serverStatus.connections.available);
    return this;
  }

  getUpTime(): PromController {
    const upTimeGauge = new this.cli.Gauge({
      name: 'mongo_uptime',
      help: 'MongoDB uptime in seconds',
    });
    upTimeGauge.set(serverStatus.uptime);
    return this;
  }

  getBytesIn(): PromController {
    const networkBytesInGauge = new this.cli.Gauge({
      name: 'mongo_network_bytes_in_total',
      help: 'Total network bytes received by MongoDB',
    });
    networkBytesInGauge.inc(serverStatus.network.bytesIn);
    return this;
  }

  getBytesOut(): PromController {
    const networkBytesOutGauge = new this.cli.Gauge({
      name: 'mongo_network_bytes_out_total',
      help: 'Total network bytes sent by MongoDB',
    });
    networkBytesOutGauge.inc(serverStatus.network.bytesOut);
    return this;
  }

  //   async getAsserts(): Promise<PromController> {
  //     const assertsGauge = new this.cli.Gauge({
  //       name: 'mongo_asserts_total',
  //       help: 'Total number of asserts',
  //     });
  //     assertsGauge.set(serverStatus.asserts.msg);
  //     return this;
  //   }
}
