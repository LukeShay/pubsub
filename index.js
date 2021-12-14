import { server as _server } from "@hapi/hapi";
import config from "config";
import { writeFile } from "fs/promises";

import {
  getClient,
  getSubscription,
  getTopic,
  getSchema,
} from "./lib/services/pubsub-service";

const start = async () => {
  console.log("Starting server.");

  const client = getClient();
  const schema = await getSchema(client);
  const topic = await getTopic(client, {
    schemaName: await schema.getName(),
  });
  const subscription = await getSubscription(topic);

  process.on("exit", async () => {
    await client.detachSubscription(subscription.name);
  });

  subscription.on("message", async (msg) => {
    /**
     * @type {import('@google-cloud/pubsub').Message}
     */
    const message = msg;

    console.log(`Received message ${message.id}:`);
    console.log(`\tMessage: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);

    const localFile = `tmp/${message.id}.json`;

    await writeFile(localFile, message.data);

    message.ack();
  });

  subscription.on("error", (error) => {
    console.log(`Received error: ${error}`);
  });

  const server = _server(config.get("server"));

  server.route({
    method: "POST",
    path: "/message",
    handler: async (request, h) => {
      try {
        const [res] = await topic.publishMessage({
          data: Buffer(JSON.stringify(request.payload)),
        });

        return { res };
      } catch (e) {
        return { error: e.message };
      }
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

start().catch(console.log);
