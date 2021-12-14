import config from "config";
import { Storage } from "@google-cloud/storage";

const client = new Storage({
  projectId: config.get("gcp.projectId"),
  ...config.get("gcp.storage.clientConfig"),
});

const bucket = client.bucket(config.get("gcp.storage.bucket"));

/**
 *
 * @param {string} filePath
 * @param {import('@google-cloud/storage').UploadOptions | undefined} opts
 * @returns
 */
const upload = (filePath, opts) => bucket.upload(filePath, opts);

export { upload };
