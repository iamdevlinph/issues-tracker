import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GetIssuesFnType } from "@/actions/get-issues.function";
import type { GetRepositoriesFnType } from "@/actions/get-repositories.function";
import { getRepoFromURL } from "@/lib/get-repo-from-url";

export type Repo = {
	id: number;
	full_name: string;
};

export type PinnedIssue = {
	id: number;
	title: string;
	repo: string;
	url: string;
};

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
					const repoName = getRepoFromURL(issue.repository_url);
					const repo = state.pinnedRepos.byName[repoName];
					const repoExists = !!repo;

					return {
						pinnedIssues: {
							all: [...state.pinnedIssues.all, issue.id],
							byId: {
								...state.pinnedIssues.byId,
								[issue.id]: issue,
							},
						},
						pinnedRepos: {
							all: repoExists
								? state.pinnedRepos.all
								: [...state.pinnedRepos.all, repoName],
							byName: {
								...state.pinnedRepos.byName,
								[repoName]: {
									name: repoName,
									issueIds: repoExists
										? [...repo.issueIds, issue.id]
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

					const repoName = getRepoFromURL(issue.repository_url);
					const repo = state.pinnedRepos.byName[repoName];
					const nextIssueIds = repo.issueIds.filter((id) => id !== issueId);

					const nextRepos = {
						...state.pinnedRepos.byName,
					};

					const nextRepoAll = state.pinnedRepos.all.filter(
						(name) => name !== repoName,
					);

					// remove empty repo
					if (nextIssueIds.length === 0) {
						delete nextRepos[repoName];
					} else {
						nextRepos[repoName] = {
							name: repoName,

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
			name: "github-auth-v3",
		},
	),
);
