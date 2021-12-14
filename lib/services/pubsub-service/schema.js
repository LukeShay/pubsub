import config from "config";
import { applyToDefaults } from "@hapi/hoek";

/**
 *
 * @param {import('@google-cloud/pubsub').PubSub} client
 * @param {string | undefined} schemaName
 * @param {string | undefined} file
 */
const getSchema = async (client, opts = {}) => {
  const { schemaName } = applyToDefaults(
    {
      schemaName: config.get("gcp.pubsub.schemaName"),
    },
    opts
  );

  return client.schema(schemaName);
};

export { getSchema };
