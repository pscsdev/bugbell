"use client";

import Forbidden from "@/components/forbidden";
import { signOut, useSession } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { IconFolderCode } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import DashboardTable from "./dashboard-table";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  // single useSession call
  const { data: currentSession, isPending: sessionPending } = useSession();
  const sessionLoading = sessionPending || currentSession == undefined;

  const router = useRouter();

  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // repos fetch
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepos() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/starred-repos");
        const data = await response.json();

        // fix: leading slash for save-user
        const saveDetails = await fetch("/api/auth/save-user");
        const j = await saveDetails.json();
        if (j?.ok) {
          console.log("successful save-user");
        } else {
          console.error("save-user failed", j);
        }

        // guard in case API returns array or { repos: [...] }
        setRepos(data?.repos ?? data ?? []);
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch repos");
        setRepos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  if (sessionLoading) {
    return <Loading />;
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
                        currentSession.user.image ||
                        "https://github.com/shadcn.png"
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
                    <DropdownMenuItem
                      className="px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-neutral-900 focus:bg-neutral-900 focus:outline-none text-red-500"
                      onClick={() =>
                        signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              router.push("/");
                            },
                          },
                        })
                      }
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>

          <div className="py-2">
            <p>Let’s go bug hunting 🚀</p>
          </div>

          {error ? (
            <div className="py-12">
              <Empty className="py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconFolderCode />
                  </EmptyMedia>
                  <EmptyTitle>Error Loading Repos</EmptyTitle>
                  <EmptyDescription>
                    {error}. Please try refreshing the page or check your GitHub
                    connection.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : loading ? (
            <div className="flex h-screen w-full justify-center py-8">
              <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
                <Item>
                  <ItemMedia>
                    <Spinner />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Loading...</ItemTitle>
                  </ItemContent>
                </Item>
              </div>
            </div>
          ) : repos.length < 1 ? (
            <div className="py-12">
              <Empty className="py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconFolderCode />
                  </EmptyMedia>
                  <EmptyTitle>No Starred Repos</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t starred any projects yet. Get started by
                    starring your first repo on Github.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <DashboardTable repos={repos} />
          )}
        </div>
      ) : (
        <Forbidden />
      )}
    </div>
  );
}
