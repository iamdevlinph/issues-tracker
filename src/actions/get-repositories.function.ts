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
		let repositories = [];

		const octokit = await installationOctokit(data.installationId);

		const repos = await octokit.rest.apps.listReposAccessibleToInstallation({
			per_page: 100,
		});

		repositories = [...repos.data.repositories];

		const totalCount = repos.data.total_count;

		let page = 1;
		let hasNextPage = true;

		// TODO: Add pagination in UI in the future or when I remember lol
		if (totalCount > 100) {
			while (hasNextPage) {
				const repos = await octokit.rest.apps.listReposAccessibleToInstallation(
					{
						per_page: 100,
						page,
					},
				);

				repositories.push(...repos.data.repositories);
				hasNextPage = repos.data.repositories.length === 100;
				page++;
			}
		}
		return repositories;
	});

export type GetRepositoriesFnType = Awaited<
	ReturnType<typeof getRepositoriesFn>
>[number];
