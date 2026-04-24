import { Calendar, Star } from "lucide-react";
import type { Issue } from "@/components/issues/types";

type IssueCardProps = {
	issue: Issue;
	isPinned: boolean;
	onTogglePin: (id: number) => void;
	options?: {
		showRepository?: boolean;
	};
};

export const IssueCard = ({
	issue,
	isPinned,
	onTogglePin,
	options,
}: IssueCardProps) => {
	const { showRepository = false } = options || {};

	return (
		<div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1.5">
						{showRepository && (
							<span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
								{issue.repository}
							</span>
						)}
						<span className="text-xs text-gray-400 dark:text-gray-500">
							#{issue.number}
						</span>
						<span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
							<Calendar className="w-3 h-3" />
							{issue.createdAt}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<h3 className="font-medium text-sm leading-snug truncate">
							{issue.title}
						</h3>
						<div className="flex gap-1.5 shrink-0">
							{issue.labels.map((label) => (
								<span
									key={label}
									className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-xs rounded-full whitespace-nowrap"
								>
									{label}
								</span>
							))}
						</div>
					</div>
				</div>
				<button
					onClick={() => onTogglePin(issue.id)}
					className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors shrink-0"
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
				</button>
			</div>
		</div>
	);
};
