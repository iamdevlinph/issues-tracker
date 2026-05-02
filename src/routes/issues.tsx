import { createFileRoute } from "@tanstack/react-router";
import { AllIssuesPage } from "@/components/issues/all-issues-page";

export const Route = createFileRoute("/issues")({
	component: Issues,
	staticData: {
		label: "Issues",
	},
	head: () => ({
		meta: [
			{
				title: "All Issues",
			},
		],
	}),
	// server: {
	// 	handlers: {
	// 		GET: async ({ request }) => {
	// 			const installationId = useAuthStore((s) => s.installationId);

	// 			if (!installationId) {
	// 				return Response.json([]);
	// 			}

	// 			const repos = await getRepositories(installationId);
	// 			console.info("🍉debuu ~ repos:", repos);
	// 		},
	// 	},
	// },
});

function Issues() {
	return <AllIssuesPage />;
}
