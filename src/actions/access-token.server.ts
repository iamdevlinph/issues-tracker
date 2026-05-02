export async function accessToken(code: string) {
	const params = JSON.stringify({
		code: code,
		client_id: process.env.VITE_CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
	});
	const res = await fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		body: params,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	return res.json();
}
