import { createHash } from "crypto";

// compare hash of two content
export const compareHash = (content1: string, content2: string) => {
  return getHash(content1) === getHash(content2);
};

// create md5 hash
const getHash = (content: string) => {
  const hash = createHash("md5");
  hash.update(content);
  return hash.digest("hex");
};
