import {
	createAppAuth,
	type InstallationAccessTokenAuthentication,
} from "@octokit/auth-app";
import { Octokit } from "octokit";

export const appOctokit = new Octokit({
	authStrategy: createAppAuth,

	auth: {
		appId: process.env.APP_ID,
		privateKey: process.env.APP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
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
