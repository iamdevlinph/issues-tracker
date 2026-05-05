import handler from "@tanstack/react-start/server-entry";

// Global error handler
addEventListener("error", (event) => {
	console.error("=== Global Error Handler ===");
	console.error("Error:", event.error);
	if (event.error instanceof Error) {
		console.error("Message:", event.error.message);
		console.error("Stack:", event.error.stack);
	}
	console.error("===========================");
});

addEventListener("unhandledrejection", (event: any) => {
	if (event.reason instanceof Error && "statusCode" in event.reason) return;
	console.error("=== Unhandled Promise Rejection ===");
	console.error("Reason:", event.reason);
	if (event.reason instanceof Error) {
		console.error("Message:", event.reason.message);
		console.error("Stack:", event.reason.stack);
	}
	console.error("===================================");
});

// REQUIRED: worker entrypoint
export default {
	async fetch(request: Request, env: any) {
		try {
			return await handler.fetch(request, env);
		} catch (err) {
			console.error("Top-level fetch error:", err);

			return new Response("Internal Server Error", {
				status: 500,
			});
		}
	},
};
