require("dotenv").config();
import { http } from "@google-cloud/functions-framework";
import { getFilteredPRs } from "./github";
import { uploadToS3 } from "./cloudflare";

http("index", async (req, res) => {
  const data = await getFilteredPRs("tarun7singh");
  const response = await uploadToS3(data);
  res.send(response);
});
