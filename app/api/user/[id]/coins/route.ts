// app/api/user/stars/route.ts
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  // Retrieve the session on the server
  const session = await getServerSession(authOptions);

  // If no session or user is found, return 0 stars
  if (!session || !session.user) {
    return new Response(JSON.stringify({ stars: 0 }), { status: 401 });
  }

  // Fetch the user's stars from the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email ?? undefined },
    select: { coinBalance: true },
  });

  // Return the user's stars, defaulting to 0 if not found
  return new Response(JSON.stringify({ stars: user?.coinBalance || 0 }), {
    status: 200,
  });
}
