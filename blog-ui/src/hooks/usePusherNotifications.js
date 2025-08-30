// hooks/usePusherNotifications.js
import { useEffect } from "react";
import { useSelector } from "react-redux";
import socketClient from "@/utils/socketClient";

export default function usePusherNotifications(onNotification) {
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!userId) return;

    const channelName = `private-notifications-${userId}`;
    const channel = socketClient.subscribe(channelName);

    channel.bind("new-notification", (data) => {
      console.log("📩 New notification:", data);
      if (onNotification) onNotification(data.notification);
    });

    return () => {
      channel.unbind("new-notification");
      socketClient.unsubscribe(channelName);
    };
  }, [userId]);
}
