import type { GetIssuesFnType } from "@/actions/get-issues.functions";

export const TrimDownIssue = (issue: GetIssuesFnType) => {
	const { id, url, repository_url, state, labels, comments, title } = issue;

	return { id, url, repository_url, state, labels, comments, title };
};
