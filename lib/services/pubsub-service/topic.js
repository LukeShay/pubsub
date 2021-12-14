import config from "config";
import { applyToDefaults } from "@hapi/hoek";

/**
 *
 * @param {import('@google-cloud/pubsub').PubSub} client
 * @param {string | undefined} topicName
 * @returns {Promise<import('@google-cloud/pubsub').Topic>}
 */
const getTopic = async (client, opts = {}) => {
  const { topicName } = applyToDefaults(
    {
      topicName: config.get("gcp.pubsub.topicName"),
    },
    opts
  );
  return client.topic(topicName);
};

export { getTopic };
