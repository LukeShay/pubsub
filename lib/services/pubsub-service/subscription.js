import config from "config";
import { applyToDefaults } from "@hapi/hoek";

/**
 * @param {import('@google-cloud/pubsub').Topic} topic
 * @param {import('@google-cloud/pubsub').SubscriptionOptions | undefined} subscriptionOptions
 */
const getSubscription = async (topic, opts = {}) => {
  const { subscriptionName, subscriptionOptions } = applyToDefaults(
    {
      subscriptionName: config.get("gcp.pubsub.subscriptionName"),
      subscriptionOptions: config.get("gcp.pubsub.subscriptionOptions"),
    },
    opts
  );

  return topic.subscription(subscriptionName, subscriptionOptions);
};

export { getSubscription };
