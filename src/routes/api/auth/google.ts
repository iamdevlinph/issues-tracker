import { createFileRoute } from "@tanstack/react-router";
import { setSession } from "@/actions/session.server";
import {
	G_ACCESS_TOKEN_COOKIE,
	G_EXPIRES_IN_COOKIE,
	G_ID_TOKEN_COOKIE,
	G_REFRESH_TOKEN_COOKIE,
} from "@/constants";

export const Route = createFileRoute("/api/auth/google")({
	server: {
		handlers: {
			GET: async () => {
				return new Response("hello world");
			},
			POST: async ({ request }) => {
				try {
					const { code } = await request.json();

					const res = await fetch("https://oauth2.googleapis.com/token", {
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: new URLSearchParams({
							code: code as string,
							client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
							client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
							redirect_uri: "postmessage",
							grant_type: "authorization_code",
						}),
					});

					const tokens = await res.json();

					const { access_token, refresh_token, id_token, expires_in } = tokens;

					const headers = new Headers();
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
						setSession(G_EXPIRES_IN_COOKIE, expires_in),
					);

					return new Response(JSON.stringify({ access_token }), {
						headers,
					});
				} catch (e) {
					return new Response("Something went wrong");
				}
			},
		},
	},
});
