import { createFileRoute } from "@tanstack/react-router";
import { getSession } from "@/actions/session.server";
import { G_ACCESS_TOKEN_COOKIE, G_REFRESH_TOKEN_COOKIE } from "@/constants";

export const Route = createFileRoute("/api/auth/google-session")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const hasAccess = getSession(G_ACCESS_TOKEN_COOKIE, request);
				const hasRefresh = getSession(G_REFRESH_TOKEN_COOKIE, request);

				if (!hasAccess || !hasRefresh) {
					return new Response(JSON.stringify({ authenticatedGoogle: false }), {
						status: 401,
					});
				}

				return new Response(JSON.stringify({ authenticatedGoogle: true }), {
					status: 200,
				});
			},
		},
	},
});
