import { createFileRoute } from "@tanstack/react-router";
import { OAuth2Client } from "google-auth-library";
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
				const oauth = new OAuth2Client(
					import.meta.env.VITE_GOOGLE_CLIENT_ID,
					process.env.GOOGLE_CLIENT_SECRET,
					"postmessage",
				);

				try {
					console.log(
						"🍉debuu ~ import.meta.env.VITE_GOOGLE_CLIENT_ID:",
						import.meta.env.VITE_GOOGLE_CLIENT_ID,
					);
					console.log(
						"🍉debuu ~ process.env.GOOGLE_CLIENT_SECRET:",
						process.env.GOOGLE_CLIENT_SECRET,
					);
					console.log(
						"🍉debuu ~ /api/auth/google request:",
						JSON.stringify(request),
					);
					const { code } = await request.json();
					console.log("🍉debuu ~ /api/auth/google code:", code);

					const { tokens } = await oauth.getToken(code);
					console.log("🍉debuu ~ /api/auth/google tokens:", tokens);

					const { access_token, refresh_token, id_token, expires_in } =
						JSON.parse(tokens as string);

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
					console.log("/api/auth/google", e);
					return new Response("Something went wrong");
				}
			},
		},
	},
});
