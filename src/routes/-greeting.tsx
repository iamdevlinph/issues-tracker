import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import {
	createFromReadableStream,
	renderToReadableStream,
} from "@tanstack/react-start/rsc";

// Create a server function
const getGreeting = createServerFn().handler(async () => {
	// const _hostname = os.hostname();
	// Create an RSC readable stream
	return renderToReadableStream(
		// Return JSX
		<h1>Hello from the server!!</h1>,
	);
});

export function Greeting() {
	const query = useQuery({
		queryKey: ["greeting"],
		queryFn: async () =>
			// Create a renderable element from the stream
			createFromReadableStream(
				// Call our server function to get the stream
				await getGreeting(),
			),
	});

	// Render!
	return <>{query.data}</>;
}
