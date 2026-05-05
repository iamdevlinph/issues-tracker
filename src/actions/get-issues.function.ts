import { createServerFn } from "@tanstack/react-start";
import { installationOctokit } from "./github-app.server";

// export async function getIssues(
// 	installationId: number,
// 	owner: string,
// 	repo: string,
// ) {
// 	const octokit = await installationOctokit(installationId);

// 	const issues = await octokit.rest.issues.listForRepo({
// 		owner,
// 		repo,
// 		state: "open",
// 		per_page: 100,
// 	});

// 	return issues.data;
// }

export const getIssuesFn = createServerFn()
	.inputValidator(
		(data: { installationId: number; owner: string; repo: string }) => data,
	)
	.handler(async ({ data }) => {
		const { installationId, owner, repo } = data;
		const octokit = await installationOctokit(installationId);

		const issues = await octokit.rest.issues.listForRepo({
			owner,
			repo,
			state: "open",
			per_page: 100,
		});

		return issues.data;
	});

export type GetIssuesFnType = Awaited<ReturnType<typeof getIssuesFn>>[number];
