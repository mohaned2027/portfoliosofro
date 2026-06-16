/**
 * src/api/echo.js
 * Laravel Echo configuration for real-time broadcasting via Laravel Reverb.
 * Only initializes when MOCK_MODE is false and Reverb env vars are set.
 */
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { MOCK_MODE, getAuthToken } from "@/api/request";
import { BASE_URL } from "@/api/endpoints";

window.Pusher = Pusher;

// Reverb connection settings — pulled from env vars (Vite exposes VITE_ prefixed vars)
const REVERB_APP_KEY = import.meta.env.VITE_REVERB_APP_KEY || "";
const REVERB_HOST = import.meta.env.VITE_REVERB_HOST || "localhost";
const REVERB_PORT = import.meta.env.VITE_REVERB_PORT || "8080";
const REVERB_SCHEME = import.meta.env.VITE_REVERB_SCHEME || "http";

let echoInstance = null;

/**
 * Returns the shared Echo instance. Creates it on first call.
 * Returns null when MOCK_MODE is true or no app key is configured.
 */
export function getEcho() {
  if (MOCK_MODE) return null;
  if (!REVERB_APP_KEY) return null;
  if (echoInstance) return echoInstance;

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: REVERB_APP_KEY,
    wsHost: REVERB_HOST,
    wsPort: Number(REVERB_PORT),
    wssPort: Number(REVERB_PORT),
    forceTLS: REVERB_SCHEME === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${BASE_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        Accept: "application/json",
      },
    },
  });

  return echoInstance;
}

/**
 * Disconnect and reset the Echo instance (e.g. on logout).
 */
export function disconnectEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}
