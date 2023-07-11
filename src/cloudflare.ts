import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { compareHash } from "./utils";

// upload json data to cloudflare r2 using @aws-sdk/client-s3
export const uploadToS3 = async (content: any) => {
  if (!process.env.CF_ACCESS_KEY_ID || !process.env.CF_ACCESS_SECRET_KEY) {
    throw new Error("AWS credentials not found");
  }

  const client = new S3Client({
    region: "auto",
    endpoint:
      "https://e4923ea68d814760b13002d1dcefca5f.r2.cloudflarestorage.com/portfolio-assets",
    credentials: {
      accessKeyId: process.env.CF_ACCESS_KEY_ID,
      secretAccessKey: process.env.CF_ACCESS_SECRET_KEY,
    },
  });

  const getCommand = new GetObjectCommand({
    Bucket: "portfolio-assets",
    Key: "tarun-pull-requests.json",
  });

  const putCommand = new PutObjectCommand({
    Bucket: "portfolio-assets",
    Key: "tarun-pull-requests.json",
    Body: JSON.stringify(content, null, 2),
  });

  try {
    // get the existing data
    const response = await client.send(getCommand);
    const existingContent = (await response.Body?.transformToString()) || "";

    // compare the hash of existing and new data and upload if different
    if (!compareHash(existingContent, JSON.stringify(content, null, 2))) {
      await client.send(putCommand);
      return "success";
    }
    return "no change";
  } catch (error) {
    console.log(error);
    return error;
  }
};
