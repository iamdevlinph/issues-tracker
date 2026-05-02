// export async function getInstallations(token: string) {
// 	const res = await fetch("https://api.github.com/user/installations", {
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 			Accept: "application/vnd.github+json",
// 			"User-Agent": "GHIT APP",
// 		},
// 	});

// 	return res.json();
// }

import { oauthOctokit } from "./github-oauth.server";

export async function getInstallations(token: string) {
	const octokit = oauthOctokit(token);

	const installations = await octokit.request("GET /user/installations");

	return installations.data;
}
