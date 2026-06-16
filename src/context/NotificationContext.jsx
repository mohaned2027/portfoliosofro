/**
 * NotificationContext.jsx
 *
 * Manages real-time notifications via Laravel Reverb (WebSocket).
 * - When MOCK_MODE = true: simulates notifications for demo/dev.
 * - When MOCK_MODE = false: connects to Reverb and listens for broadcast events.
 *
 * Notifications are displayed as toast popups (via sonner) and stored in state
 * for the notification dropdown in the admin header.
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { toast } from "sonner";
import { MOCK_MODE } from "@/api/request";
import { getEcho, disconnectEcho } from "@/api/echo";
import { useAuth } from "@/context/AuthContext";

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  return ctx;
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const echoRef = useRef(null);

  const addNotification = useCallback((notification) => {
    const entry = {
      id:
        notification.id ||
        `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: notification.title || "New Notification",
      message: notification.message || "",
      type: notification.type || "info",
      read: false,
      created_at: notification.created_at || new Date().toISOString(),
      data: notification.data || null,
    };

    setNotifications((prev) => [entry, ...prev].slice(0, 50));
    setUnreadCount((c) => c + 1);

    // Show toast
    const toastFn =
      entry.type === "error"
        ? toast.error
        : entry.type === "success"
          ? toast.success
          : toast.info;
    toastFn(entry.title, { description: entry.message });

    return entry;
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Connect to Reverb when user is authenticated
  useEffect(() => {
    if (!user) {
      disconnectEcho();
      echoRef.current = null;
      return;
    }

    if (MOCK_MODE) return;

    const echo = getEcho();
    if (!echo) return;
    echoRef.current = echo;

    // Listen on a private channel for the authenticated user
    const channel = echo.private(`App.Models.User.${user.id}`);

    // Listen for ContactUsNotification (new contact message)
    channel.notification((notification) => {
      addNotification({
        id: notification.id,
        title: "New Contact Message",
        message: `${notification.name}: ${notification.subject || notification.message || ""}`,
        type: "info",
        data: notification,
        created_at: notification.created_at,
      });
    });

    // Listen for generic broadcast events
    channel.listen(".notification.sent", (event) => {
      addNotification({
        title: event.title || "Notification",
        message: event.message || "",
        type: event.type || "info",
        data: event,
      });
    });

    return () => {
      if (echoRef.current) {
        echoRef.current.leave(`App.Models.User.${user.id}`);
      }
    };
  }, [user, addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
