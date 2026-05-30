import { SiGithub } from "@icons-pack/react-simple-icons";
import { AlertCircleIcon } from "lucide-react";
import { GithubLogout } from "@/components/account/github/github-logout-button";
import { GithubLogin } from "@/components/account/github/login-github";
import { ManageGithubAccess } from "@/components/account/manage-github-access";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";

export const GithubSection = () => {
	const authenticated = useAuthStore((s) => s.authenticated);
	const githubLogin = useAuthStore((s) => s.githubLogin);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<SiGithub color="#cecece" />
					Github
				</CardTitle>
				<CardDescription>
					Login with Github to access repositories and issues
				</CardDescription>
			</CardHeader>
			<CardContent>
				{!authenticated ? (
					<GithubLogin />
				) : (
					<div className="flex flex-col gap-5">
						<div className="">
							Logged in as <strong>{githubLogin}</strong>
						</div>

						<div className="flex gap-2">
							<ManageGithubAccess />

							<GithubLogout />
						</div>

						<Alert variant="destructive" className="max-w-md grid">
							<AlertCircleIcon />
							<AlertTitle>Before you logout</AlertTitle>
							<AlertDescription>
								Logging out will also clear pinned issues. You will need to pin
								them again.
							</AlertDescription>
						</Alert>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
