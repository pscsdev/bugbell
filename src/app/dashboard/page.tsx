"use client";

import Forbidden from "@/components/forbidden";
import { useSession } from "@/lib/auth-client";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const result = useSession();
  const session = result?.data ?? result;
  const isLoading = result?.isPending ?? session == undefined;
  const { data: currentSession } = useSession();

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch('/api/starred-repos');
        const data = await response.json();
        console.log(data)
        setRepos(data.repos);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <div>
      {currentSession ? (
        <div className="py-8">
          <div className="flex justify-between">
            <h1 className="md:text-3xl text-2xl font-bold">
              Yo, {currentSession.user.name}!
            </h1>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="inline-flex rounded-full focus:outline-none focus:ring-0">
                    <Avatar className="cursor-pointer inline-flex">
                      <AvatarImage
                        src={
                          currentSession.user.image || "https://github.com/shadcn.png"
                        }
                        alt={currentSession.user.name}
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
                    className="w-56 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-lg"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-neutral-900 focus:bg-neutral-900 focus:outline-none">
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-neutral-900 focus:bg-neutral-900 focus:outline-none">
                        My account
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
          </div>
          <div className="py-2">
            <p>Let’s go bug hunting 🚀</p>
          </div>
        </div>
      ) : (
        <Forbidden />
      )}
    </div>
  );
}
