import config from "config";
import { applyToDefaults } from "@hapi/hoek";

/**
 *
 * @param {import('@google-cloud/pubsub').PubSub} client
 * @param {string | undefined} topicName
 * @returns {Promise<import('@google-cloud/pubsub').Topic>}
 */
const getTopic = async (client, opts = {}) => {
  const { topicName, schemaName, schemaEncoding } = applyToDefaults(
    {
      topicName: config.get("gcp.pubsub.topicName"),
      schemaName: config.get("gcp.pubsub.schemaConfig.name"),
      schemaEncoding: config.get("gcp.pubsub.schemaConfig.encoding"),
    },
    opts
  );
  const topic = client.topic(topicName);

  const [topicExists] = await topic.exists();
  if (!topicExists) {
    console.log(`creating topic ${topicName}`);
    
    const [top] = await client.createTopic({
      name: topicName,
      schemaSettings: {
        schema: schemaName,
        encoding: schemaEncoding,
      },
    });

    return top;
  }

  return topic;
};

export { getTopic };
