import { AlertCircle, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Forbidden() {
    return (
        <main>
            <Alert className="bg-neutral-950 text-white">
                <AlertCircleIcon />
                <AlertTitle>Forbidden</AlertTitle>
                <AlertDescription className="text-neutral-400">
                    <p>Unable to process your request due to one of the following reasons.</p>
                    <ul className="list-inside list-disc text-sm">
                        <li>You are not authenticated</li>
                        <li>Internal Server Error</li>
                    </ul>
                </AlertDescription>
            </Alert>
            <div className="text-center py-8">
                <Link href={"/"}>
                <Button className="cursor-pointer">
                    Back to Homepage
                </Button>
                </Link>
                
            </div>
        </main>
    )
}