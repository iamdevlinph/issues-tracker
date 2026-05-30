import { SiGoogledrive } from "@icons-pack/react-simple-icons";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const GoogleSection = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<SiGoogledrive color="#cecece" />
					Google Drive
				</CardTitle>
				<CardDescription>
					Login with Google to sync data to Google Drive.
				</CardDescription>
				<CardDescription>
					This app can only access the data created by this app.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<a href={"#"}>
					<Button variant="outline">Login with google</Button>
				</a>
			</CardContent>
		</Card>
	);
};
