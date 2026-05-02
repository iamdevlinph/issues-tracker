import { Star } from "lucide-react";
import { useState } from "react";
import { NoPinnedIssues } from "@/components/empty/no-pinned-issues";
import type { Issue } from "@/components/issues/types";
import { PageTitle } from "@/components/page-title";
import { mockPinnedIssues } from "@/lib/dummy-data";

export const PinnedIssuesPage = () => {
	const [pinnedIssues, setPinnedIssues] = useState<Issue[]>(mockPinnedIssues);

	const togglePin = (id: number) => {
		setPinnedIssues((prev) => prev.filter((issue) => issue.id !== id));
	};

	const groupedByRepo = pinnedIssues.reduce(
		(acc, issue) => {
			if (!acc[issue.repository]) {
				acc[issue.repository] = [];
			}
			acc[issue.repository].push(issue);
			return acc;
		},
		{} as Record<string, Issue[]>,
	);

	return (
		<>
			<PageTitle
				title="Pinned Issues"
				description="Your starred issues organized by repository"
			/>

			<NoPinnedIssues />

			{Object.keys(groupedByRepo).length === 0 ? (
				<div className="text-center py-12">
					<Star className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
					<p className="text-gray-500 dark:text-gray-400">
						No pinned issues yet. Visit the All Issues page to star some issues.
					</p>
				</div>
			) : (
				<div className="space-y-8">
					{Object.entries(groupedByRepo).map(([repo, issues]) => (
						<div key={repo}>
							<h3 className="font-semibold mb-4 text-sm text-gray-600 dark:text-gray-400 font-mono">
								{repo}
							</h3>
							<div className="space-y-3">
								{/* {issues.map((issue) => (
									<IssueCard
										key={issue.id}
										issue={issue}
										isPinned={true}
										onTogglePin={togglePin}
									/>
								))} */}
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
};
