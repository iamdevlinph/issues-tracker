import { AnimatePresence, motion } from "framer-motion";
import { NoPinnedIssues } from "@/components/empty/no-pinned-issues";
import { NotLoggedIn } from "@/components/empty/not-logged-in";
import { IssueCard } from "@/components/issues/issue-card";
import { PageTitle } from "@/components/page-title";
import { useAuthStore } from "@/stores/auth-store";

export const PinnedIssuesPage = () => {
	const pinnedRepos = useAuthStore((s) => s.pinnedRepos);
	const pinnedIssues = useAuthStore((s) => s.pinnedIssues);
	const authenticated = useAuthStore((s) => s.authenticated);
	const hasPinnedIssues = (pinnedIssues.all ?? []).length > 0;

	return (
		<>
			<PageTitle
				title="Pinned Issues"
				description="Your starred issues organized by repository"
			/>

			{!authenticated && <NotLoggedIn />}

			{authenticated && !hasPinnedIssues && <NoPinnedIssues />}

			{authenticated && hasPinnedIssues && (
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
									<AnimatePresence>
										{issues.map((issue) => (
											<motion.div
												key={issue.id}
												initial={{
													opacity: 0,
													x: 20,
												}}
												animate={{
													opacity: 1,
													x: 0,
													transition: {
														duration: 0.1,
													},
												}}
												exit={{
													opacity: 0,
													x: -30,
												}}
												transition={{
													duration: 0.3,
												}}
											>
												<IssueCard
													key={issue.id}
													issue={issue}
													isPinned={pinnedIssues.all.includes(issue.id)}
												/>
											</motion.div>
										))}
									</AnimatePresence>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
};
