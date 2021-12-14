import config from "config";
import { PubSub } from "@google-cloud/pubsub";

const getClient = () =>
  new PubSub({
    projectId: config.get("gcp.projectId"),
    ...config.get("gcp.pubsub.clientConfig"),
  });

export { getClient };
