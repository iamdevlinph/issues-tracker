import { useEffect } from "react";
import { GithubLogin } from "@/components/account/login-github";
import { LogoutButton } from "@/components/account/logout-button";
import { ManageGithubAccess } from "@/components/account/manage-github-access";
import { PageTitle } from "@/components/page-title";
import { useAuthStore } from "@/stores/auth-store";

export const AccountPage = () => {
	const setAuth = useAuthStore((s) => s.setAuth);
	const authenticated = useAuthStore((s) => s.authenticated);

	const githubLogin = useAuthStore((s) => s.githubLogin);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);

		const login = params.get("login");

		const installationId = Number(params.get("installationId"));

		if (login && installationId) {
			setAuth(login, installationId);
		}
	}, [setAuth]);

	return (
		<>
			<PageTitle
				title="Account"
				description="Manage Github account or repository access"
			/>

			<div className="flex flex-col gap-4">
				{!authenticated ? (
					<GithubLogin />
				) : (
					<>
						<div>
							Logged in as <strong>{githubLogin}</strong>
						</div>

						<ManageGithubAccess />

						<LogoutButton />
					</>
				)}
			</div>
		</>
	);
};
