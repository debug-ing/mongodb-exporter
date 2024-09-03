import express, { Request, Response } from 'express';
import { cli } from './services/prom';
import { client } from './services/mongo';
import { PromController } from './controller/prom.controller';
import { COLLECTION_NAME } from './config/mongo.config';
//

async function main() {
  const prom = new PromController(cli, client);
  const server = await prom.connect(COLLECTION_NAME);
  const statusConnection = true;
  if (statusConnection) {
    server.getOpenConnections().getAvailableConnections();
  }
  //
  const statusUptime = true;
  if (statusUptime) {
    server.getUpTime();
  }
  //
  const statusNetwork = true;
  if (statusNetwork) {
    server.getBytesIn().getBytesOut();
  }
  //
}
main();
//
//wat
const app = express();
const port = 3000;

app.get('/metrics', async (req: Request, res: Response) => {
    res.set('Content-Type', cli.register.contentType);
    res.end(await cli.register.metrics());
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
