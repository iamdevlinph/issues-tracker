import { createServerFn } from "@tanstack/react-start";
import { installationOctokit } from "./github-app.server";

// export async function getRepositories(installationId: number) {
// 	const octokit = await installationOctokit(installationId);

// 	const repos = await octokit.rest.apps.listReposAccessibleToInstallation();

// 	return repos.data.repositories;
// }

export const getRepositoriesFn = createServerFn()
	.inputValidator((data: { installationId: number }) => data)
	.handler(async ({ data }) => {
		const octokit = await installationOctokit(data.installationId);

		const repos = await octokit.rest.apps.listReposAccessibleToInstallation();

		return repos.data.repositories;
	});
