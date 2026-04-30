import { Button } from "@/components/ui/button";

export const GithubLogin = () => {
	const GITHUB_URL = "https://github.com/login/oauth/authorize?";
	const AUTH_URL = `${GITHUB_URL}client_id=${process.env.CLIENT_ID}`;
	return (
		<a href={AUTH_URL}>
			<Button variant="outline">
				Login with github {process.env.CLIENT_ID}
			</Button>
		</a>
	);
};
