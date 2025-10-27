"use client"

import { useSession } from "@/lib/auth-client"

export default function Dashboard() {

    const {data: session} = useSession();

    return (
        <main>
            <div>Hello {session?.user.name}</div>
        </main>
    )
}