import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { IssueCard } from "@/components/issues/issue-card";
import { mockIssues } from "@/lib/dummy-data";

export const Route = createFileRoute("/issues")({
	component: Issues,
	staticData: {
		label: "Issues",
	},
});

function Issues() {
	const [pinnedIds, setPinnedIds] = useState<number[]>([1, 2, 3, 4, 5]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRepo, setSelectedRepo] = useState<string>("all");

	const togglePin = (id: number) => {
		setPinnedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const repositories = [
		"all",
		...Array.from(new Set(mockIssues.map((i) => i.repository))),
	];

	const filteredIssues = mockIssues.filter((issue) => {
		const matchesSearch = issue.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesRepo =
			selectedRepo === "all" || issue.repository === selectedRepo;
		return matchesSearch && matchesRepo;
	});

	return (
		<>
			<div className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">All Issues</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Browse and manage issues across all repositories
				</p>
			</div>

			<div className="mb-6 flex gap-4">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search issues..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
					/>
				</div>
				<select
					value={selectedRepo}
					onChange={(e) => setSelectedRepo(e.target.value)}
					className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
				>
					{repositories.map((repo) => (
						<option key={repo} value={repo}>
							{repo === "all" ? "All Repositories" : repo}
						</option>
					))}
				</select>
			</div>

			<div className="space-y-3">
				{filteredIssues.length === 0 ? (
					<div className="text-center py-12 text-gray-500 dark:text-gray-400">
						No issues found
					</div>
				) : (
					filteredIssues.map((issue) => (
						<IssueCard
							key={issue.id}
							issue={issue}
							isPinned={pinnedIds.includes(issue.id)}
							onTogglePin={togglePin}
							options={{ showRepository: true }}
						/>
					))
				)}
			</div>
		</>
	);
}
