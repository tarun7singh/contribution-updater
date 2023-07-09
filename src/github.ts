import { Octokit } from "@octokit/rest";

// initialize github client
const github = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// get a specific users's github merged pull requests and clean them
export const getFilteredPRs = async (username: string) => {
  const events = await github.request("GET /search/issues", {
    q: `is:pr author:${username} archived:false is:closed `,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const pullRequests = events.data.items
    .filter((item) => item.pull_request?.merged_at)
    .map((item) => {
      const repository_url = item.repository_url.split("/");
      const repository_name = `${repository_url[repository_url.length - 2]}/${
        repository_url[repository_url.length - 1]
      }`;
      return {
        title: item.title,
        url: item.html_url,
        merged_at: item.pull_request?.merged_at || "",
        repository_url: item.repository_url
          .replace("https://api.", "https://")
          .replace("/repos/", "/"),
        repository_name,
      };
    })
    .sort((a, b) => {
      if (a.merged_at < b.merged_at) {
        return 1;
      }
      if (a.merged_at > b.merged_at) {
        return -1;
      }
      return 0;
    })
    .reduce((acc: any, curr: any) => {
      const key = curr.repository_name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});

  return pullRequests;
};