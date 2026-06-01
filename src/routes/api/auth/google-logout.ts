import { createFileRoute } from "@tanstack/react-router";
import { destroySession } from "@/actions/session.server";
import { GOOGLE_COOKIES_DESTROY, GOOGLE_LOCAL_DESTROY } from "@/constants";

export const Route = createFileRoute("/api/auth/google-logout")({
	server: {
		handlers: {
			GET: async () => {
				const headers = new Headers();

				GOOGLE_COOKIES_DESTROY.forEach((key) => {
					const cookie = destroySession(key);

					headers.append("Set-Cookie", cookie);
				});

				GOOGLE_LOCAL_DESTROY.forEach((key) => {
					localStorage.removeItem(key);
				});

				return new Response("Google related cookies destroyed", {
					status: 200,

					headers,
				});
			},
		},
	},
});
