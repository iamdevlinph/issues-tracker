import { createFileRoute } from "@tanstack/react-router";
import { getSession, setSession } from "@/actions/session.server";
import {
	G_ACCESS_TOKEN_COOKIE,
	G_EXPIRES_IN_COOKIE,
	G_ID_TOKEN_COOKIE,
	G_REFRESH_TOKEN_COOKIE,
} from "@/constants";

export const Route = createFileRoute("/api/auth/google-session")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const expiresIn = getSession(G_EXPIRES_IN_COOKIE, request);
				const hasAccess = getSession(G_ACCESS_TOKEN_COOKIE, request);
				const hasRefresh = getSession(G_REFRESH_TOKEN_COOKIE, request);

				if (!hasAccess || !hasRefresh) {
					return new Response(JSON.stringify({ authenticatedGoogle: false }), {
						status: 401,
					});
				}

				const headers = new Headers();

				// refresh token if expires in already behind Date.now
				// or if expires_in is 3599 (default value)
				if (
					parseInt(expiresIn as string) <= Date.now() ||
					parseInt(expiresIn as string) === 3599
				) {
					const res = await fetch("https://oauth2.googleapis.com/token", {
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: new URLSearchParams({
							client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
							client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
							refresh_token: hasRefresh as string,
							grant_type: "refresh_token",
						}),
					});

					const tokens = await res.json();

					const { access_token, refresh_token, id_token, expires_in } = tokens;

					headers.append(
						"Set-Cookie",
						setSession(G_ACCESS_TOKEN_COOKIE, access_token),
					);
					headers.append(
						"Set-Cookie",
						setSession(G_REFRESH_TOKEN_COOKIE, refresh_token),
					);
					headers.append("Set-Cookie", setSession(G_ID_TOKEN_COOKIE, id_token));
					headers.append(
						"Set-Cookie",
						setSession(
							G_EXPIRES_IN_COOKIE,
							(Date.now() + expires_in * 1000).toString(),
						),
					);
				}

				return new Response(JSON.stringify({ authenticatedGoogle: true }), {
					status: 200,
					headers,
				});
			},
		},
	},
});
