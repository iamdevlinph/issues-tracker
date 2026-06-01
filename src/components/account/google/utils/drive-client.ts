import { getGoogleAccessTokenFn } from "@/components/account/google/utils/get-google-access-token";

export async function driveFetch(input: RequestInfo, init?: RequestInit) {
	const token = await getGoogleAccessTokenFn();

	if (!token) throw new Error("No token");

	return fetch(input, {
		...init,
		headers: {
			Authorization: `Bearer ${token}`,
			...(init?.headers || {}),
		},
	});
}
