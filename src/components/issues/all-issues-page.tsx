import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getIssuesFn } from "@/actions/get-issues.function";
import { getRepositoriesFn } from "@/actions/get-repositories.function";
import { NoRepository } from "@/components/empty/no-repository";
import { NotLoggedIn } from "@/components/empty/not-logged-in";
import { IssueCard } from "@/components/issues/issue-card";
import { PageTitle } from "@/components/page-title";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { useAuthStore } from "@/stores/auth-store";

export const AllIssuesPage = () => {
	const queryClient = useQueryClient();
	const installationId = useAuthStore((s) => s.installationId);
	const authenticated = useAuthStore((s) => s.authenticated);
	const getRepos = useServerFn(getRepositoriesFn);
	const getIssues = useServerFn(getIssuesFn);
	const [selectedRepo, setRepo] = useState("");

	const repositoriesData = useQuery({
		queryKey: ["repositories"],
		queryFn: async () => {
			if (!installationId) {
				return [];
			}

			return getRepos({
				data: { installationId },
			});
		},
		enabled: !!installationId,
		initialData: [],
		refetchOnWindowFocus: true,
	});

	const issuesData = useQuery({
		queryKey: ["issues", selectedRepo],
		queryFn: async () => {
			if (!installationId) {
				return [];
			}

			const [owner, repo] = selectedRepo.split("/");
			console.info("🍉debuu ~ AllIssuesPage ~ [owner, repo]:", [owner, repo]);

			const issues = await getIssues({
				data: { installationId, owner, repo },
			});
			console.info("🍉debuu ~ AllIssuesPage ~ issues:", issues);
			return issues;
		},
		enabled: !!selectedRepo,
		initialData: [],
	});

	return (
		<>
			<PageTitle
				title="All Issues"
				description="Browse and manage issues across all repositories"
			/>

			{!repositoriesData.isFetched && <div>Loading...</div>}

			{repositoriesData.isFetched && (
				<div>
					{!authenticated && <NotLoggedIn />}

					{authenticated && repositoriesData.data.length === 0 && (
						<NoRepository />
					)}

					{authenticated && repositoriesData.data.length > 0 && (
						<>
							<Combobox
								items={repositoriesData.data}
								onValueChange={(e) => {
									setRepo(e as string);
								}}
							>
								<ComboboxInput
									placeholder="Select a repository"
									className="w-max"
								/>
								<ComboboxContent>
									<ComboboxEmpty>No items found.</ComboboxEmpty>
									<ComboboxList>
										{(item: (typeof repositoriesData.data)[number]) => (
											<ComboboxItem key={item.id} value={item.full_name}>
												{item.full_name}
											</ComboboxItem>
										)}
									</ComboboxList>
								</ComboboxContent>
							</Combobox>

							<div className="space-y-3 mt-5">
								{issuesData.data.map((issue, idx) => {
									return (
										<IssueCard
											key={issue.id}
											issue={issue}
											// isPinned={pinnedIds.includes(issue.id)}
											isPinned={idx % 2 === 0}
											options={{ showRepository: true }}
											onTogglePin={() => {}}
										/>
									);
								})}
							</div>

							{/* <div className="space-y-3">
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
							</div> */}
						</>
					)}
				</div>
			)}
		</>
	);
};
