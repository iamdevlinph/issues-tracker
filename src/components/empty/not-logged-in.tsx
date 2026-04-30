import { EmptySection } from "@/components/empty/empty";
import { GithubLogin } from "@/components/login-github";

export const NotLoggedIn = () => {
	return (
		<EmptySection
			title="No Issues"
			description="You are currently not logged in."
		>
			<GithubLogin />
		</EmptySection>
	);
};
