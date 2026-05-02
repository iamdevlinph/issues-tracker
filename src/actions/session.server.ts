import { parse, serialize } from "cookie";

export const COOKIE_NAME = "github_token";

export function setSession(token: string) {
	return serialize(COOKIE_NAME, token, {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 30,
	});
}

export function getSession(request: Request) {
	const cookies = parse(request.headers.get("cookie") || "");

	return cookies[COOKIE_NAME];
}

export function destroySession() {
	return serialize(COOKIE_NAME, "", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		path: "/",
		expires: new Date(0),
	});
}
