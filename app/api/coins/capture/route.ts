// app/api/coins/capture/route.ts
import { NextResponse } from "next/server";
import { client, paypal } from "@/lib/paypal";
import { determineCoinsForAmount } from "@/lib/coins";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // adjust as needed
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId } = await req.json();
  if (!orderId)
    return NextResponse.json({ error: "orderId required" }, { status: 400 });

  try {
    const captureReq = new paypal.orders.OrdersCaptureRequest(orderId);
    captureReq.requestBody({ payment_source: {} as any });

    const capture = await client.execute(captureReq);
    const status = capture.result.status; // expected 'COMPLETED'
    if (status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const pu = capture.result.purchase_units?.[0];
    const captureObj = pu?.payments?.captures?.[0];
    const amountStr = captureObj?.amount?.value ?? "0";
    const amountUSD = parseFloat(amountStr);

    const coinsGranted = determineCoinsForAmount(amountUSD);
    const userId = session.user.id;

    // Persist in transaction
    await prisma.$transaction(async (tx) => {
      const external = await tx.externalPayment.create({
        data: {
          provider: "PAYPAL",
          providerOrder: orderId,
          userId,
          amountUSD,
          coinsGranted,
          status,
          metadata: capture.result,
        },
      });

      await tx.coinTransaction.create({
        data: {
          userId,
          amount: coinsGranted,
          type: TransactionType.PURCHASE,
          reference: external.id,
          metadata: capture.result,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { coinBalance: { increment: coinsGranted } },
      });
    });

    return NextResponse.json({ success: true, coinsGranted });
  } catch (err) {
    console.error("PayPal capture error", err);
    return NextResponse.json({ error: "Capture failed" }, { status: 500 });
  }
}
