import config from "config";
import { applyToDefaults } from "@hapi/hoek";

/**
 * @param {import('@google-cloud/pubsub').Topic} topic
 * @param {import('@google-cloud/pubsub').SubscriptionOptions | undefined} subscriptionOptions
 */
const getSubscription = async (topic, opts = {}) => {
  const { subscriptionName, subscriptionOptions } = applyToDefaults(
    {
      subscriptionName: `${config.get("gcp.pubsub.topicName")}-subscriber`,
      subscriptionOptions: config.get("gcp.pubsub.subscriptionOptions"),
    },
    opts
  );

  const subscription = topic.subscription(
    subscriptionName,
    subscriptionOptions
  );

  const [subscriptionExists] = await subscription.exists();
  if (!subscriptionExists) {
    const [sub] = await topic.createSubscription(
      subscriptionName,
      subscriptionOptions
    );
    return sub;
  }

  return subscription;
};

export { getSubscription };
