// src/server/notifications.ts
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  url?: string;
  imageUrl?: string;
  data?: Record<string, unknown>;
};

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      url: input.url,
      imageUrl: input.imageUrl,
      data: input.data ? (input.data as any) : undefined,
    },
    select: {
      id: true,
      userId: true,
      type: true,
      title: true,
      body: true,
      url: true,
      imageUrl: true,
      data: true,
      isRead: true,
      createdAt: true,
    },
  });
}

export async function markNotificationRead(params: {
  userId: string;
  id: string;
}) {
  // security: only update rows belonging to user
  const updated = await prisma.notification.updateMany({
    where: { id: params.id, userId: params.userId },
    data: { isRead: true, readAt: new Date() },
  });
  return updated.count === 1;
}

export async function markAllNotificationsRead(params: { userId: string }) {
  return prisma.notification.updateMany({
    where: { userId: params.userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}
