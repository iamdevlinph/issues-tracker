import { getContrastColor } from "@/lib/get-contrast-color";

type IssueLabelProps = {
	label: string;
	color: string;
};

export function IssueLabel({ label, color }: IssueLabelProps) {
	const bg = `#${color}`;

	const text = getContrastColor(color);

	return (
		<div
			className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border"
			style={{
				backgroundColor: bg,

				color: text,

				borderColor: "rgba(0,0,0,0.1)",
			}}
		>
			{label}
		</div>
	);
}
