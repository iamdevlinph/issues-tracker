import {
	createAppAuth,
	type InstallationAccessTokenAuthentication,
} from "@octokit/auth-app";
import { createServerOnlyFn } from "@tanstack/react-start";
import { Octokit } from "octokit";

const getAppPrivateKey = createServerOnlyFn(() => process.env.APP_PRIVATE_KEY);

export const appOctokit = new Octokit({
	authStrategy: createAppAuth,

	auth: {
		appId: import.meta.env.VITE_APP_ID,
		privateKey: getAppPrivateKey()?.replace(/\\n/g, "\n"),
		// clientId: process.env.VITE_CLIENT_ID,
		// clientSecret: process.env.CLIENT_SECRET,
	},
});

export async function installationOctokit(installationId: number) {
	const auth = (await appOctokit.auth({
		type: "installation",

		installationId,
	})) as InstallationAccessTokenAuthentication; // fix auth.token auth is unknown

	return new Octokit({
		auth: auth.token,
	});
}
