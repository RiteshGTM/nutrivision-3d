import Constants from "expo-constants";

/**
 * Dynamically resolves the backend host from Expo's Metro bundler `hostUri`.
 *
 * When you run `npx expo start`, Expo sets `hostUri` to something like:
 *   "192.168.x.x:8081"  (your laptop's current IP on whatever network is active)
 *
 * By stripping the Metro port we always get the correct laptop IP —
 * whether the phone is on home WiFi, mobile hotspot, or any other network.
 *
 * Falls back to EXPO_PUBLIC_API_URL (from .env) if hostUri is unavailable,
 * which is useful for production / CI builds.
 */
const getDynamicApiUrl = (): string => {
  // Allow a hard override via .env (useful for production or special setups)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // In Expo Go / dev builds, hostUri = "<laptop-ip>:<metro-port>"
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const laptopIp = hostUri.split(":")[0];
    return `http://${laptopIp}:8080/api/v1`;
  }

  // Last resort fallback (Android emulator loopback)
  return "http://10.0.2.2:8080/api/v1";
};

export const API_BASE_URL = getDynamicApiUrl();
export const API_TIMEOUT = 15000;

