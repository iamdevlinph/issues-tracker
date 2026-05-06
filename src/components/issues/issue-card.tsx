import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Calendar, MessageCircleOff, MessageSquare, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { GetIssuesFnType } from "@/actions/get-issues.functions";
import { updateIssueFn } from "@/actions/update-issue.functions";
import { IssueLabel } from "@/components/issues/issue-label";
import { getRepoFromURL } from "@/lib/get-repo-from-url";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

type IssueCardProps = {
	issue: GetIssuesFnType;
	isPinned: boolean;
	options?: {
		showRepository?: boolean;
	};
};

export const IssueCard = ({ issue, isPinned, options }: IssueCardProps) => {
	const { showRepository = false } = options || {};
	const pinIssue = useAuthStore((s) => s.pinIssue);
	const unpinIssue = useAuthStore((s) => s.unpinIssue);
	const installationId = useAuthStore((s) => s.installationId);
	const updateIssue = useServerFn(updateIssueFn);
	const [issueCloseInProgress, setIssueClose] = useState(false);

	const date = new Date(issue.created_at);
	const formattedCreatedAt = date.toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
	const { fullRepoName, owner, repo } = getRepoFromURL(issue.repository_url);

	return (
		<div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1.5">
						{showRepository && (
							<span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
								{fullRepoName}
							</span>
						)}
						<span className="text-xs text-gray-400 dark:text-gray-500">
							#{issue.number}
						</span>
						<span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
							<Calendar className="w-3 h-3" />
							{formattedCreatedAt}
						</span>
						<span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
							<MessageSquare className="w-3 h-3" />
							{issue.comments}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<a href={issue.html_url} target="_blank">
							<h3 className="font-medium text-sm leading-snug truncate hover:underline">
								{issue.title}
							</h3>
						</a>
						<div className="flex gap-1.5 shrink-0">
							{issue.labels.map((label) => {
								const { id, color, name } = label as Exclude<
									GetIssuesFnType["labels"][number],
									string
								>;
								return (
									<IssueLabel
										key={id}
										label={name as string}
										color={color as string}
									/>
								);
							})}
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<motion.button
						whileTap={{ scale: 0.9, rotate: 20 }}
						onClick={() => (isPinned ? unpinIssue(issue.id) : pinIssue(issue))}
						className={cn(
							"p-1 rounded  transition-colors shrink-0",
							"-m-2.5 p-2.5",
							"cursor-pointer",
						)}
						aria-label={isPinned ? "Unpin issue" : "Pin issue"}
						type="button"
					>
						<Star
							className={`w-4 h-4 ${
								isPinned
									? "fill-yellow-400 text-yellow-400"
									: "text-gray-400 dark:text-gray-500"
							}`}
						/>
					</motion.button>

					{isPinned && (
						<motion.button
							whileTap={{ scale: 0.9, rotate: 20 }}
							onClick={async () => {
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

									unpinIssue(issue.id);
								} catch (e) {
									toast.error("Unable to close issue", {
										description: (e as Error).message,
									});
								} finally {
									setIssueClose(false);
								}
							}}
							className={cn(
								"p-1 rounded  transition-colors shrink-0",
								"-m-2.5 p-2.5",
								"cursor-pointer",
							)}
							aria-label={isPinned ? "Unpin issue" : "Pin issue"}
							type="button"
							disabled={issueCloseInProgress}
						>
							<MessageCircleOff className={cn("w-4 h-4")} />
						</motion.button>
					)}
				</div>
			</div>
		</div>
	);
};
