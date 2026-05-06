import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getSingleIssueFn } from "@/actions/get-single-issue.functions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/auth-store";

export const AddIssueURL = () => {
	const installationId = useAuthStore((s) => s.installationId);
	const pinIssue = useAuthStore((s) => s.pinIssue);
	const getSingleIssue = useServerFn(getSingleIssueFn);
	const [issueUrl, setIssueUrl] = useState("");
	const [error, setError] = useState("");
	const [open, setOpen] = useState(false);

	const singleIssue = useQuery({
		queryKey: ["single-issue"],
		queryFn: async () => {
			setError("");
			try {
				if (!installationId) {
					return [];
				}

				const issuesUrlSplit = issueUrl.split("/");
				const owner = issuesUrlSplit[3];
				const repo = issuesUrlSplit[4];
				const issue_number = +issuesUrlSplit[6];

				const data = await getSingleIssue({
					data: {
						installationId,
						owner,
						repo,
						issue_number,
					},
				});

				pinIssue(data);

				setOpen(false);
				setIssueUrl("");
			} catch (e) {
				const msg = (e as Error).message;
				setError(msg);
				toast.error("Something went wrong when trying to add issue by URL", {
					description: msg,
				});
			}
		},
		enabled: false,
	});

	const handleAddIssue = () => {
		singleIssue.refetch();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium"
				>
					<Plus className="w-4 h-4" />
					Add Issue
				</button>
			</DialogTrigger>
			<DialogContent
				className="[&>button]:hidden"
				onInteractOutside={(e) => {
					e.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle>Add Issue by URL</DialogTitle>
					<DialogDescription>
						Enter a <u>public</u> GitHub issue URL to add it to your pinned
						issues
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 mt-4">
					<div>
						<input
							type="text"
							placeholder="https://github.com/owner/repo/issues/123"
							value={issueUrl}
							onChange={(e) => setIssueUrl(e.target.value)}
							className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleAddIssue();
								}
							}}
							disabled={singleIssue.isFetching}
						/>
						{error && <p className="text-sm text-red-500 mt-2">{error}</p>}
					</div>
					<div className="flex justify-end gap-2">
						<button
							onClick={() => {
								setIssueUrl("");
								setOpen(false);
							}}
							className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
							type="button"
							disabled={singleIssue.isFetching}
						>
							Cancel
						</button>
						<Button
							onClick={handleAddIssue}
							type="submit"
							disabled={singleIssue.isFetching || issueUrl.length === 0}
						>
							{singleIssue.isFetching && <Spinner data-icon="inline-start" />}
							Add Issue
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
