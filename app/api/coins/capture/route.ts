import { NextResponse } from "next/server";
import { client, paypal } from "@/lib/paypal";
import { determineCoinsForAmount } from "@/lib/coins";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

// Type for the request body
interface CaptureRequest {
  orderId: string;
}

// Type for PayPal capture request body (minimal)
interface CaptureRequestData {
  payment_source?: any; // Adjust based on your payment method needs
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId }: CaptureRequest = await req.json();
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  try {
    const captureReq = new paypal.orders.OrdersCaptureRequest(orderId);
    // Provide a minimal payment_source object to satisfy the type
    const requestBody: CaptureRequestData = {
      payment_source: {}, // Empty object should work for PayPal orders
    };
    // captureReq.requestBody(requestBody);

    const captureResponse = await client.execute(captureReq);
    const captureResult = captureResponse.result;

    // Validate PayPal response structure
    if (!captureResult.status || !captureResult.purchase_units) {
      throw new Error("Invalid PayPal response structure");
    }

    const status = captureResult.status;
    if (status !== "COMPLETED") {
      return NextResponse.json(
        { error: `Payment status: ${status}, expected COMPLETED` },
        { status: 400 }
      );
    }

    const purchaseUnit = captureResult.purchase_units[0];
    const captureObj = purchaseUnit.payments?.captures?.[0];
    if (!captureObj || !captureObj.amount?.value) {
      throw new Error("Missing capture details in PayPal response");
    }

    const amountStr = captureObj.amount.value;
    const amountUSD = parseFloat(amountStr);
    const coinsGranted = determineCoinsForAmount(amountUSD);
    const userId = session.user.id;

    if (coinsGranted <= 0) {
      throw new Error("Invalid coin amount calculated");
    }

    // Persist in transaction
    await prisma.$transaction(async (tx) => {
      console.log(
        `Creating ExternalPayment for user ${userId}, order ${orderId}`
      );
      const external = await tx.externalPayment.create({
        data: {
          provider: "PAYPAL",
          providerOrder: orderId,
          userId,
          amountUSD,
          coinsGranted,
          status,
          metadata: captureResult,
        },
      });

      console.log(`Creating CoinTransaction for external ${external.id}`);
      await tx.coinTransaction.create({
        data: {
          userId,
          amount: coinsGranted,
          type: TransactionType.PURCHASE,
          reference: external.id,
          metadata: captureResult,
        },
      });

      console.log(`Updating user ${userId} coinBalance by +${coinsGranted}`);
      await tx.user.update({
        where: { id: userId },
        data: { coinBalance: { increment: coinsGranted } },
      });
    });

    console.log(
      `Capture successful, granted ${coinsGranted} coins to user ${userId}`
    );
    return NextResponse.json({ success: true, coinsGranted });
  } catch (err: any) {
    console.error("PayPal capture error", err);
    const errorMessage = err.message || "Capture failed";
    const statusCode = err.statusCode || 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
