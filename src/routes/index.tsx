import { createFileRoute } from "@tanstack/react-router";
import { PinnedIssuesPage } from "@/components/issues/pinned-issues-page";

export const Route = createFileRoute("/")({
	component: Index,
	staticData: {
		label: "Starred",
	},
	head: () => ({
		meta: [
			{
				title: "Pinned Issues",
			},
		],
	}),
});

function Index() {
	return <PinnedIssuesPage />;
}
