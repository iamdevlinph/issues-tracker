import { useServerFn } from "@tanstack/react-start";
import { Ellipsis, MessageCircleOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { GetIssuesFnType } from "@/actions/get-issues.functions";
import { updateIssueFn } from "@/actions/update-issue.functions";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { getRepoFromURL } from "@/lib/get-repo-from-url";
import { useAuthStore } from "@/stores/auth-store";

type PinnedIssueMenuProps = {
	issue: GetIssuesFnType;
};

export function PinnedIssueMenu({ issue }: PinnedIssueMenuProps) {
	const installationId = useAuthStore((s) => s.installationId);
	const pinnedIssues = useAuthStore((s) => s.pinnedIssues);
	const unpinIssue = useAuthStore((s) => s.unpinIssue);
	const [issueCloseInProgress, setIssueClose] = useState(false);
	const [open, setOpen] = useState(false);
	const updateIssue = useServerFn(updateIssueFn);

	const isPinned = pinnedIssues.all.includes(issue.id);

	const { owner, repo } = getRepoFromURL(issue.repository_url);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<button className="cursor-pointer " type="button">
					<Ellipsis size={18} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40" align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem
						onSelect={async (e) => {
							e.preventDefault();

							setIssueClose(true);
							try {
								if (!installationId) {
									throw new Error("installationId is missing");
								}

								await updateIssue({
									data: {
										owner,
										repo,
										issue_number: issue.number,
										state: "closed",
										installationId,
									},
								});

								setOpen(false);

								unpinIssue(issue.id);
							} catch (e) {
								toast.error("Unable to close issue", {
									description: (e as Error).message,
								});
							} finally {
								setIssueClose(false);
							}
						}}
						aria-label={isPinned ? "Unpin issue" : "Pin issue"}
						disabled={issueCloseInProgress}
					>
						{issueCloseInProgress ? (
							<Spinner data-icon="inline-start" />
						) : (
							<MessageCircleOff data-icon="inline-start" />
						)}
						Close issue
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
