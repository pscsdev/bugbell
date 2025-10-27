import { useSession } from "@/lib/auth-client"

export default function MyAccount() {

    const {data: session} = useSession();

    return (
        <main>

        </main>
    )
}