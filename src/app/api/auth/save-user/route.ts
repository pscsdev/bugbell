import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { databases, Query } from "@/lib/appwrite";

export async function GET(req: Request) {
  try {
    const DB_ID = process.env.APPWRITE_DATABASE_ID;
    const COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;

    if (!DB_ID || !COLLECTION_ID) {
      console.error(
        "Missing Appwrite env vars: APPWRITE_DATABASE_ID or APPWRITE_USERS_COLLECTION_ID"
      );
      return NextResponse.json(
        {
          ok: false,
          error: "Server misconfiguration: missing Appwrite env vars",
        },
        { status: 500 }
      );
    }

    const session = await auth.api.getSession({ headers: req.headers as any });
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "No session" },
        { status: 401 }
      );
    }

    const payload = {
      authId: user.id,
      email: user.email ?? null,
      name: user.name ?? null,
      avatar: user.image ?? null,
      updatedAt: new Date().toISOString(),
    };

    const list = await databases.listDocuments(DB_ID, COLLECTION_ID, [
        Query.equal("authId", user.id),
    ]);

    if(list.total > 0) {
        const existing = list.documents[0];
        await databases.updateDocument(DB_ID, COLLECTION_ID, existing.$id, payload)
    } else {
        await databases.createDocument(DB_ID, COLLECTION_ID, "unique()", payload)
    }

    return NextResponse.json({ok: true});

  } catch (e) {
    console.error("save-user error: ", e)
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
