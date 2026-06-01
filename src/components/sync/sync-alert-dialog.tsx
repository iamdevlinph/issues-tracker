import { readableBytes } from "common-utils-pkg";
import {
	download,
	select,
	upload,
} from "@/components/account/google/utils/drive-sync";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/stores/auth-store";

export function SyncConflictDialog() {
	const conflict = useAuthStore((s) => s.syncConflict);
	const setConflict = useAuthStore((s) => s.setSyncConflict);

	if (!conflict) return null;

	const fmt = (ts: number) => new Date(ts).toLocaleString();

	return (
		<AlertDialog open={!!conflict}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Sync conflict detected</AlertDialogTitle>

					<AlertDialogDescription>
						Choose which version to keep. This will overwrite the other copy.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="space-y-4 text-sm">
					<div className="border rounded p-3">
						<div className="font-medium">Local copy</div>
						<div>Last updated: {fmt(conflict.local.updatedAt)}</div>
						<div>Size: {readableBytes(conflict.local.size, 2)}</div>
					</div>

					<div className="border rounded p-3">
						<div className="font-medium">Remote copy (Google Drive)</div>
						<div>Last updated: {fmt(conflict.remote.updatedAt)}</div>
						<div>Size: {readableBytes(conflict.remote.size, 2)}</div>
					</div>
				</div>

				<AlertDialogFooter>
					<AlertDialogAction
						onClick={async () => {
							// KEEP LOCAL
							await upload(select(useAuthStore.getState()));
							setConflict(null);
						}}
					>
						Keep Local
					</AlertDialogAction>

					<AlertDialogAction
						onClick={() => {
							// KEEP REMOTE
							setConflict(null);

							(async () => {
								const remote = await download();

								if (!remote) return;

								useAuthStore.setState({
									pinnedRepos: remote.pinnedRepos,
									pinnedIssues: remote.pinnedIssues,
									backupUpdatedAt: remote.backupUpdatedAt,
								});
							})();
						}}
					>
						Keep Remote
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
