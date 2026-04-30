import { EmptySection } from "@/components/empty/empty";
import { GithubLogin } from "@/components/login-github";

export const NoPinnedIssues = () => {
	return (
		<EmptySection
			title="No Pinned Issues"
			description="You don't have any pinned issues yet. Start by logging in with your Github account."
		>
			<GithubLogin />
		</EmptySection>
	);
};
