import { createServerFn } from "@tanstack/react-start";
import { serialize } from "cookie";
import { COOKIE_NAME } from "@/actions/session.server";

export const logoutServerFn = createServerFn({
	method: "POST",
}).handler(async () => {
	const cookie = serialize(COOKIE_NAME, "", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		path: "/",
		expires: new Date(0),
	});

	return new Response(null, {
		status: 200,

		headers: {
			"Set-Cookie": cookie,
		},
	});
});
