import config from "config";
import avro from "avro-js";

const getDefinition = () =>
  JSON.stringify(config.get("gcp.pubsub.schemaConfig.definition"));

const parseDefinition = avro.parse;

export { getDefinition, parseDefinition };
