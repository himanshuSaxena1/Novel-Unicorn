// src/app/api/notifications/[id]/read/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { markNotificationRead } from "@/lib/server/notifications";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const ok = await markNotificationRead({ userId: user.id, id });
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
