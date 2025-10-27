"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <main className="flex flex-col h-full">
      <nav className="flex ">
        <div className="flex w-full justify-between my-4">
          <h1 className="font-bold md:text-2xl text-xl">BugBell</h1>
          <div className="flex space-x-4">
            {session ? (
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : (
              <Button onClick={() => signIn.social({ provider: "github" })}>
                Sign in with github
              </Button>
            )}
          </div>
        </div>
      </nav>
      <div className="md:py-50 py-20">
        <div className="text-center">
          <h1 className="md:text-6xl text-4xl font-bold mb-4">
            Stop hopping between repos. Track all your contributions in{" "}
            <span className="bg-amber-500">one place</span>
          </h1>
        </div>
      </div>
    </main>
  );
}
