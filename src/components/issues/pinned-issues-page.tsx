import { NoPinnedIssues } from "@/components/empty/no-pinned-issues";
import { IssueCard } from "@/components/issues/issue-card";
import { PageTitle } from "@/components/page-title";
import { useAuthStore } from "@/stores/auth-store";

export const PinnedIssuesPage = () => {
	const pinnedRepos = useAuthStore((s) => s.pinnedRepos);
	const pinnedIssues = useAuthStore((s) => s.pinnedIssues);
	const hasPinnedIssues = (pinnedIssues.all ?? []).length > 0;

	return (
		<>
			<PageTitle
				title="Pinned Issues"
				description="Your starred issues organized by repository"
			/>

			{!hasPinnedIssues ? (
				<NoPinnedIssues />
			) : (
				<div className="space-y-8">
					{pinnedRepos.all.map((repoName) => {
						const repo = pinnedRepos.byName[repoName];

						const issues = repo.issueIds
							.map((id) => pinnedIssues.byId[id])
							.filter(Boolean);

						return (
							<div key={repoName}>
								<h3 className="font-semibold mb-4 text-sm text-gray-600 dark:text-gray-400 font-mono">
									{repoName}
								</h3>

								<div className="space-y-3">
									{issues.map((issue) => (
										<IssueCard
											key={issue.id}
											issue={issue}
											isPinned={pinnedIssues.all.includes(issue.id)}
											// onTogglePin={togglePin}
										/>
									))}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
};
