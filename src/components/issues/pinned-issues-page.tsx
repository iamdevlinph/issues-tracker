import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { NoPinnedIssues } from "@/components/empty/no-pinned-issues";
import { NotLoggedIn } from "@/components/empty/not-logged-in";
import { AddIssueURL } from "@/components/issues/add-issue-url";
import { IssueCard } from "@/components/issues/issue-card";
import { PinnedIssuesSearch } from "@/components/issues/pinned-issues-search";
import { PageTitle } from "@/components/page-title";
import { getRepoFromURL } from "@/lib/get-repo-from-url";
import { useAuthStore } from "@/stores/auth-store";

export const PinnedIssuesPage = () => {
	const pinnedRepos = useAuthStore((s) => s.pinnedRepos);
	const pinnedIssues = useAuthStore((s) => s.pinnedIssues);
	const authenticated = useAuthStore((s) => s.authenticated);
	const hasPinnedIssues = (pinnedIssues.all ?? []).length > 0;
	const [search, setSearch] = useState("");

	const groupedIssues = useMemo(() => {
		const query = search.trim();

		const allIssues = pinnedIssues.all
			.map((id) => pinnedIssues.byId[id])
			.filter(Boolean);

		// no search
		if (!query) {
			return pinnedRepos.all.reduce(
				(acc, repoName) => {
					const repo = pinnedRepos.byName[repoName];

					acc[repoName] = repo.issueIds
						.map((id) => pinnedIssues.byId[id])
						.filter(Boolean);

					return acc;
				},
				{} as Record<string, typeof allIssues>,
			);
		}

		const lower = query.toLowerCase();

		const filtered = allIssues.filter((issue) => {
			const { fullRepoName } = getRepoFromURL(issue.repository_url);

			return (
				issue.title.toLowerCase().includes(lower) ||
				fullRepoName.toLowerCase().includes(lower)
			);
		});

		return filtered.reduce(
			(acc, issue) => {
				const { fullRepoName } = getRepoFromURL(issue.repository_url);

				if (!acc[fullRepoName]) {
					acc[fullRepoName] = [];
				}
				acc[fullRepoName].push(issue);

				return acc;
			},
			{} as Record<string, typeof filtered>,
		);
	}, [search, pinnedIssues, pinnedRepos]);

	return (
		<>
			<PageTitle
				title="Pinned Issues"
				description="Your starred issues organized by repository"
				aside={<AddIssueURL />}
			/>

			{!authenticated && <NotLoggedIn />}

			{authenticated && !hasPinnedIssues && <NoPinnedIssues />}

			{authenticated && hasPinnedIssues && (
				<div className="space-y-8">
					<PinnedIssuesSearch search={search} setSearch={setSearch} />

					{/* {pinnedRepos.all.map((repoName) => {
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
												<IssueCard key={issue.id} issue={issue} />
											</motion.div>
										))}
									</AnimatePresence>
								</div>
							</div>
						);
					})} */}

					{Object.entries(groupedIssues).map(([repoName, issues]) => {
						return (
							<motion.div key={repoName} layout>
								<h3 className="font-semibold mb-4 text-sm text-gray-600 dark:text-gray-400 font-mono">
									{repoName}
								</h3>

								<div className="space-y-3">
									<AnimatePresence>
										{issues.map((issue) => (
											<motion.div
												key={issue.id}
												layout
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
												<IssueCard issue={issue} />
											</motion.div>
										))}
									</AnimatePresence>
								</div>
							</motion.div>
						);
					})}
				</div>
			)}
		</>
	);
};
