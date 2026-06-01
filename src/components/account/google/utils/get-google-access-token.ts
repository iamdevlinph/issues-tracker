import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getSession } from "@/actions/session.server";
import { G_ACCESS_TOKEN_COOKIE } from "@/constants";

export const getGoogleAccessTokenFn = createServerFn().handler(async () => {
	const request = getRequest();
	const token = getSession(G_ACCESS_TOKEN_COOKIE, request);

	return token;
});
