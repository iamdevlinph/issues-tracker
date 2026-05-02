import { create } from "zustand";
import { persist } from "zustand/middleware";

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
	// repositories: Repo[];
	pinnedIssues: PinnedIssue[];

	setAuth: (login: string, installationId: number) => void;
	// setRepositories: (repos: Repo[]) => void;
	pinIssue: (issue: PinnedIssue) => void;
	unpinIssue: (issueId: number) => void;
	logout: () => void;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			authenticated: false,
			githubLogin: null,
			installationId: null,
			// repositories: [],
			pinnedIssues: [],

			setAuth: (login, installationId) =>
				set({
					authenticated: true,
					githubLogin: login,
					installationId,
				}),

			// setRepositories: (repos) =>
			// 	set({
			// 		repositories: repos,
			// 	}),

			pinIssue: (issue) =>
				set((state) => ({
					pinnedIssues: [...state.pinnedIssues, issue],
				})),

			unpinIssue: (issueId) =>
				set((state) => ({
					pinnedIssues: state.pinnedIssues.filter(
						(issue) => issue.id !== issueId,
					),
				})),

			logout: () =>
				set({
					authenticated: false,
					githubLogin: null,
					installationId: null,
					// repositories: [],
					pinnedIssues: [],
				}),
		}),
		{
			name: "github-auth",
		},
	),
);
