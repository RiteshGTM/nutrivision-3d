// -----------
export const API_BASE_URL = "http://10.0.2.2:8080/api/v1";
export const API_TIMEOUT = 15000;
// -----------

// // import Constants from "expo-constants";

// // const getDevelopmentHost = (): string | null => {
// //   const hostUri = Constants.expoConfig?.hostUri;

// //   if (!hostUri) {
// //     return null;
// //   }

// //   // Expo hostUri is normally something like:
// //   // 192.168.1.100:8081
// //   // Remove the Metro port and keep only the laptop IP/hostname.
// //   return hostUri.split(":")[0];
// // };

// // const developmentHost = getDevelopmentHost();

// // export const API_BASE_URL =
// //   process.env.EXPO_PUBLIC_API_URL ??
// //   (developmentHost
// //     ? `http://${developmentHost}:8080/api/v1`
// //     : "http://localhost:8080/api/v1");

// // export const API_TIMEOUT = 15000;

// import Constants from "expo-constants";

// const isAndroidEmulator = true;

// const getDevelopmentHost = (): string | null => {
//   const hostUri = Constants.expoConfig?.hostUri;

//   if (!hostUri) {
//     return null;
//   }

//   return hostUri.split(":")[0];
// };

// const developmentHost = getDevelopmentHost();

// export const API_BASE_URL = isAndroidEmulator
//   ? "http://10.0.2.2:8080/api/v1"
//   : (process.env.EXPO_PUBLIC_API_URL ??
//     (developmentHost
//       ? `http://${developmentHost}:8080/api/v1`
//       : "http://localhost:8080/api/v1"));

// export const API_TIMEOUT = 15000;
