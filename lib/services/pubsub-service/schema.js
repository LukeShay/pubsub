import config from "config";
import { applyToDefaults } from "@hapi/hoek";
import { getDefinition } from "./definition";

/**
 *
 * @param {import('@google-cloud/pubsub').PubSub} client
 * @param {string | undefined} schemaName
 * @param {string | undefined} file
 */
const getSchema = async (client, opts = {}) => {
  const { schemaName, definition, type } = applyToDefaults(
    {
      schemaName: config.get("gcp.pubsub.schemaConfig.name"),
      definition: getDefinition(),
      type: config.get("gcp.pubsub.schemaConfig.type"),
    },
    opts
  );

  try {
    return await client.createSchema(schemaName, type, definition);
  } catch (e) {
    return client.schema(schemaName);
  }
};

export { getSchema };
