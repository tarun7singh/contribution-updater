import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// upload json data to cloudflare r2 using @aws-sdk/client-s3
export const uploadToS3 = async (data: any) => {
  if (!process.env.CF_ACCESS_KEY_ID || !process.env.CF_ACCESS_SECRET_KEY) {
    throw new Error("AWS credentials not found");
  }

  const client = new S3Client({
    region: "auto",
    endpoint: "https://e4923ea68d814760b13002d1dcefca5f.r2.cloudflarestorage.com/portfolio-assets",
    credentials: {
      accessKeyId: process.env.CF_ACCESS_KEY_ID,
      secretAccessKey: process.env.CF_ACCESS_SECRET_KEY,
    },
  });

  const command = new PutObjectCommand({
    Bucket: "portfolio-assets",
    Key: "tarun-pull-requests.json",
    Body: JSON.stringify(data, null, 2),
  });

  try {
    const response = await client.send(command);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
