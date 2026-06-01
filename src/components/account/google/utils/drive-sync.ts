import { toast } from "sonner";
import { driveFetch } from "@/components/account/google/utils/drive-client";
import { type AuthState, useAuthStore } from "@/stores/auth-store";

const FILE_NAME = "state.json";

let fileId: string | null = null;
let debounce: number;

type Backup = Pick<
	AuthState,
	"pinnedRepos" | "pinnedIssues" | "backupUpdatedAt"
>;

export function select(state: AuthState): Backup {
	return {
		pinnedRepos: state.pinnedRepos,
		pinnedIssues: state.pinnedIssues,
		backupUpdatedAt: state.backupUpdatedAt,
	};
}

async function findFile() {
	const res = await driveFetch(
		"https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name)",
	);

	const json = await res.json();
	return json.files?.find((f: File) => f.name === FILE_NAME);
}

async function createFile(data: Backup) {
	const form = new FormData();

	form.append(
		"metadata",
		new Blob(
			[JSON.stringify({ name: FILE_NAME, parents: ["appDataFolder"] })],
			{ type: "application/json" },
		),
	);

	form.append(
		"file",
		new Blob([JSON.stringify(data)], {
			type: "application/json",
		}),
	);

	const res = await driveFetch(
		"https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
		{ method: "POST", body: form },
	);

	const json = await res.json();
	fileId = json.id;
}

export async function download(): Promise<Backup | null> {
	if (!fileId) return null;

	const res = await driveFetch(
		`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
	);

	return res.json();
}

export async function upload(data: Backup) {
	if (!fileId) return;

	await driveFetch(
		`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		},
	);
}

export async function initSync() {
	toast.info("Initializing data");

	useAuthStore.getState().setSyncInProgress(true);

	try {
		// existing logic
		const local = useAuthStore.getState();

		const existing = await findFile();

		if (!existing) {
			await createFile(select(local));
			setupAutoSync();
			return;
		}

		fileId = existing.id;

		const remote = await download();
		if (remote && remote.backupUpdatedAt !== local.backupUpdatedAt) {
			useAuthStore.setState({
				syncConflict: {
					local: {
						updatedAt: local.backupUpdatedAt,
						size: getSize(local),
					},
					remote: { updatedAt: remote.backupUpdatedAt, size: getSize(remote) },
				},
			});
		} else {
			await upload(select(local));
		}

		setupAutoSync();
	} catch (e) {
		toast.error("Something went wrong with initializing data", {
			description: (e as Error).message,
		});
	} finally {
		useAuthStore.getState().setSyncInProgress(false);
	}
}

let isSyncing = false;

function setupAutoSync() {
	const unsubscribe = useAuthStore.subscribe(
		(state) => state.backupUpdatedAt,
		(newValue, prevValue) => {
			if (newValue === prevValue) return;

			// 🚨 prevent sync loop re-entry
			if (isSyncing) return;

			clearTimeout(debounce);

			debounce = window.setTimeout(async () => {
				toast.info("Sync start");
				isSyncing = true;
				useAuthStore.getState().setSyncInProgress(true);

				try {
					const data = select(useAuthStore.getState());
					await upload(data);

					toast.success("Sync success");
				} catch (e) {
					toast.error("Sync failed", { description: (e as Error).message });
				} finally {
					useAuthStore.getState().setSyncInProgress(false);
					isSyncing = false;
				}
			}, 800);
		},
	);

	return unsubscribe;
}

function getSize(obj: unknown) {
	return new Blob([JSON.stringify(obj)]).size;
}
