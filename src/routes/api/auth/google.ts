import { createFileRoute } from "@tanstack/react-router";
import { OAuth2Client } from "google-auth-library";
import { setSession } from "@/actions/session.server";
import {
	G_ACCESS_TOKEN_COOKIE,
	G_EXPIRES_IN_COOKIE,
	G_ID_TOKEN_COOKIE,
	G_REFRESH_TOKEN_COOKIE,
} from "@/constants";

const oauth = new OAuth2Client(
	import.meta.env.VITE_GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	"postmessage",
);

export const Route = createFileRoute("/api/auth/google")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const { code } = await request.json();

				const { tokens } = await oauth.getToken(code);

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
			},
		},
	},
});
