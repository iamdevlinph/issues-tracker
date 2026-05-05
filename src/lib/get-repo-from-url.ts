import type { GetIssuesFnType } from "@/actions/get-issues.functions";

export const getRepoFromURL = (url: GetIssuesFnType["repository_url"]) => {
	const repoSplit = url.split("/");
	const author = repoSplit.at(-2);
	const repository = repoSplit.at(-1);

	return `${author}/${repository}`;
};
