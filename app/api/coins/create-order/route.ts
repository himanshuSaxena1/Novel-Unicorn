// app/api/coins/create-order/route.ts
import { NextResponse } from "next/server";
import { client, paypal } from "@/lib/paypal";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // adjust path if needed

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { packageId } = body;

  // Map packageId => amount USD
  const packages: Record<string, number> = {
    bronze: 9.99,
    silver: 29.99,
    gold: 49.99,
    platinum: 99.99,
    // also accept numeric packageId
    "9.99": 9.99,
    "29.99": 29.99,
    "49.99": 49.99,
    "99.99": 99.99,
  };

  const amountUSD = packages[packageId] ?? null;
  if (!amountUSD) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: String(amountUSD),
        },
        custom_id: String(packageId),
      },
    ],
    application_context: {
      brand_name: process.env.NEXT_PUBLIC_SITE_NAME || "MySite",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/coins/capture-success`, // optional redirect
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/coins`,
    },
  });

  try {
    const order = await client.execute(request);
    return NextResponse.json({
      orderId: order.result.id,
      links: order.result.links,
    });
  } catch (err) {
    console.error("PayPal create order error", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
