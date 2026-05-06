import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GetIssuesFnType } from "@/actions/get-issues.functions";
import type { GetRepositoriesFnType } from "@/actions/get-repositories.functions";
import { getRepoFromURL } from "@/lib/get-repo-from-url";

type AuthState = {
	authenticated: boolean;
	githubLogin: string | null;
	installationId: number | null;

	pinnedRepos: {
		all: GetRepositoriesFnType["full_name"][];
		byName: Record<
			string,
			{
				name: GetRepositoriesFnType["full_name"];
				issueIds: number[];
			}
		>;
	};
	pinnedIssues: {
		all: GetIssuesFnType["id"][];
		byId: Record<string, GetIssuesFnType>;
	};

	setAuth: (login: string, installationId: number) => void;
	pinIssue: (issue: GetIssuesFnType) => void;
	unpinIssue: (issueId: number) => void;
	logout: () => void;
};

const initialState = {
	authenticated: false,
	githubLogin: null,
	installationId: null,
	pinnedRepos: { all: [], byName: {} },
	pinnedIssues: { all: [], byId: {} },
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			...initialState,

			setAuth: (login, installationId) =>
				set({
					authenticated: true,
					githubLogin: login,
					installationId,
				}),

			pinIssue: (issue) =>
				set((state) => {
					const { fullRepoName } = getRepoFromURL(issue.repository_url);
					const repo = state.pinnedRepos.byName[fullRepoName];
					const repoExists = !!repo;
					const issueExists = !!state.pinnedIssues.byId[issue.id];

					// already checked in the add-issue-url
					// maybe just remove
					const issueAlreadyInRepo = repoExists
						? repo.issueIds.includes(issue.id)
						: false;

					return {
						pinnedIssues: {
							all: issueExists
								? state.pinnedIssues.all
								: [...state.pinnedIssues.all, issue.id],
							byId: {
								...state.pinnedIssues.byId,
								[issue.id]: issue,
							},
						},
						pinnedRepos: {
							all: repoExists
								? state.pinnedRepos.all
								: [...state.pinnedRepos.all, fullRepoName],
							byName: {
								...state.pinnedRepos.byName,
								[fullRepoName]: {
									name: fullRepoName,
									issueIds: repoExists
										? issueAlreadyInRepo
											? repo.issueIds
											: [...repo.issueIds, issue.id]
										: [issue.id],
								},
							},
						},
					};
				}),

			unpinIssue: (issueId) =>
				set((state) => {
					const issue = state.pinnedIssues.byId[issueId];

					if (!issue) {
						return state;
					}

					const { fullRepoName } = getRepoFromURL(issue.repository_url);
					const repo = state.pinnedRepos.byName[fullRepoName];
					const nextIssueIds = repo.issueIds.filter((id) => id !== issueId);

					const nextRepos = {
						...state.pinnedRepos.byName,
					};

					const nextRepoAll = state.pinnedRepos.all.filter(
						(name) => name !== fullRepoName,
					);

					// remove empty repo
					if (nextIssueIds.length === 0) {
						delete nextRepos[fullRepoName];
					} else {
						nextRepos[fullRepoName] = {
							name: fullRepoName,

							issueIds: nextIssueIds,
						};
					}

					const nextIssues = {
						...state.pinnedIssues.byId,
					};

					delete nextIssues[issueId];

					return {
						pinnedIssues: {
							all: state.pinnedIssues.all.filter((id) => id !== issueId),
							byId: nextIssues,
						},
						pinnedRepos: {
							all:
								nextIssueIds.length === 0 ? nextRepoAll : state.pinnedRepos.all,
							byName: nextRepos,
						},
					};
				}),

			logout: () => set({ ...initialState }),
		}),
		{
			name: "issues-tracker-app",
		},
	),
);
