import { SearchIcon, X } from "lucide-react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

type PinnedIssuesSearchProps = {
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export const PinnedIssuesSearch = ({
	search,
	setSearch,
}: PinnedIssuesSearchProps) => {
	return (
		<InputGroup>
			<InputGroupInput
				placeholder="Search repositories or issues"
				onChange={(e) => setSearch(e.target.value)}
				value={search}
			/>
			<InputGroupAddon>
				<SearchIcon />
			</InputGroupAddon>
			<InputGroupAddon align="inline-end">
				<X />
			</InputGroupAddon>
		</InputGroup>
	);
};
