type PageTitleProps = {
	title: string;
	description: string;
};

export const PageTitle = ({ title, description }: PageTitleProps) => {
	return (
		<div className="mb-6">
			<h2 className="text-2xl font-semibold mb-2">{title}</h2>
			<p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
		</div>
	);
};
