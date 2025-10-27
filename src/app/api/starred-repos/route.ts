import { auth } from "@/lib/auth";
import { number } from "better-auth";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Github access invalid" },
        { status: 400 }
      );
    }
    const accessToken = await auth.api.getAccessToken({
      body: {
        providerId: "github",
        userId: session.user.id,
      },
    });

    if (!accessToken) {
      return NextResponse.json(
        { error: "No GitHub access token" },
        { status: 400 }
      );
    }

    const starredRepos = await fetchAllStarredRepos(accessToken.accessToken);

    const reposWithIssues = await Promise.all(
      starredRepos.map(async (repo: any) => {
        const issues = await fetchRepoIssues(
          accessToken.accessToken,
          repo.owner.login,
          repo.name
        );

        return {
          id: repo.id,
          name: repo.name,
          language: repo.language,
        };
      })
    );
    return NextResponse.json({ repos: reposWithIssues });
  } catch (error) {
    console.error("Error fetching starred repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch repos" },
      { status: 500 }
    );
  }
}

async function fetchAllStarredRepos(token: string) {
  let page = 1;
  let allRepos: any[] = [];
  const perPage = 30;

  while (true) {
    const response = await fetch(
      `https://api.github.com/user/starred?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const repos = await response.json();
    if (repos.length === 0) break;
    allRepos = [...allRepos, ...repos];
    if (repos.length < perPage) break;
    page++;
  }
  return allRepos;
}

async function fetchRepoIssues(token: string, owner: string, repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=30`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  if(!response.ok) {
    return [];
  }
  const issues = await response.json();
  return issues.map((issue: any) => ({
    number: issue.number,
    title: issue.title,
    state: issue.state,
    url: issue.html_url,
    createdAt: issue.created_at
  }))
}
