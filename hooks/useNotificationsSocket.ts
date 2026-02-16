"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useNotificationsSocket({
  userId,
  onNotification,
}: {
  userId?: string;
  onNotification: () => void;
}) {
  const handlerRef = useRef(onNotification);

  // Always keep latest callback without retriggering socket effect
  useEffect(() => {
    handlerRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    if (!userId) return;

    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", {
        path: "/api/socket",
      });
    }

    socket.emit("join", userId);

    const listener = () => {
      handlerRef.current();
    };

    socket.off("notification:new");
    socket.on("notification:new", listener);

    return () => {
      socket?.off("notification:new", listener);
    };
  }, [userId]); 
}
