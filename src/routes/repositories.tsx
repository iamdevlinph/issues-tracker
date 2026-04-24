import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/repositories")({
	component: Repositories,
});

function Repositories() {
	return <div>Hello "/repositories"!</div>;
}
