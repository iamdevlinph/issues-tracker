import type { GetIssuesFnType } from "@/actions/get-issues.functions";

export const trimDownIssue = (issue: GetIssuesFnType) => {
	const { id, url, repository_url, state, labels, comments, title } = issue;

	return { id, url, repository_url, state, labels, comments, title };
};
