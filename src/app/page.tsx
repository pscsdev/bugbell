"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session);

  return (
    <main className="flex flex-col h-full">
      <nav className="flex ">
        <div className="flex w-full justify-between my-4">
          <h1 className="font-bold md:text-2xl text-xl">BugBell</h1>
          <div className="flex space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="inline-flex rounded-full focus:outline-none focus:ring-0">
                    <Avatar className="cursor-pointer inline-flex">
                      <AvatarImage
                        src={
                          session.user.image || "https://github.com/shadcn.png"
                        }
                        alt={session.user.name}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    sideOffset={8}
                    className="w-56 rounded-md border border-neutral-700 bg-neutral-900 text-neutral-100 shadow-lg"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none" onClick={() => router.push("/dashboard")}>
                        Dashboard
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                      <DropdownMenuItem className="px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none" onClick={() => signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            router.push("/");
                          }
                        }
                      })}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() =>
                  signIn.social({
                    provider: "github",
                    callbackURL: "/dashboard",
                    errorCallbackURL: "/",
                  })
                }
              >
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
