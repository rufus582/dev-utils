// import { useRegisterSW } from "virtual:pwa-register/react";
// import { createContext, useEffect, useRef } from "react";
// import { toast } from "sonner";
// import { useTimeout } from "@/hooks/use-timeout";

// const SW_REFRESH_INTERVAL_MS = parseInt(
//   import.meta.env.DEVUTILS_SW_REFRESH_INTERVAL_MS || "1000",
//   10,
// );

// const SW_UPDATE_WINDOW_MS = parseInt(
//   import.meta.env.DEVUTILS_SW_UPDATE_ON_LOAD_WINDOW_MS || "10000",
//   10,
// );

// type PWASideEffectStateType = "pending" | "completed";

// const PWASideEffectState = {
//   get: () =>
//     (localStorage.getItem("pwa-side-effect-state") ??
//       "pending") as PWASideEffectStateType,
//   set: (state: PWASideEffectStateType) =>
//     localStorage.setItem("pwa-side-effect-state", state),
// };

// interface PWAProviderProps {
//   needRefresh: boolean;
//   updateServiceWorker: () => void;
// }

// const initialState: PWAProviderProps = {
//   needRefresh: false,
//   updateServiceWorker: () => null,
// };

// const PWAProviderContext = createContext<PWAProviderProps>(initialState);

// const AutoUpdatePWAToast = ({
//   initialSeconds,
//   onComplete,
// }: {
//   initialSeconds: number;
//   onComplete: () => void;
// }) => {
//   const { remainingSeconds } = useTimeout({
//     initialTimeout: initialSeconds,
//     onTimeout: onComplete,
//   });

//   return (
//     <div>New content available. Updating in {remainingSeconds} seconds...</div>
//   );
// };

// function PWAProvider({ children }: { children: React.ReactNode }) {
//   const canUpdatePWA = useRef(false);

//   const {
//     needRefresh: [needRefresh, setNeedRefresh],
//     updateServiceWorker: updatePWAServiceWorker,
//   } = useRegisterSW({
//     onRegisteredSW(_, registration) {
//       if (!registration) return;

//       setInterval(() => {
//         registration.update();
//       }, SW_REFRESH_INTERVAL_MS);
//     },
//     onRegisterError(error) {
//       console.log("SW registration error", error);
//     },
//     onNeedRefresh() {
//       if (canUpdatePWA.current) {
//         const toastId = toast.loading(
//           <AutoUpdatePWAToast
//             initialSeconds={5}
//             onComplete={() => {
//               updateServiceWorker();
//               canUpdatePWA.current = false;
//               toast.dismiss(toastId);
//             }}
//           />,
//         );
//       }
//     },
//   });

//   useEffect(() => {
//     const handleLoad = async () => {
//       canUpdatePWA.current = true;
//       setTimeout(() => {
//         canUpdatePWA.current = false;
//       }, SW_UPDATE_WINDOW_MS);
//     };

//     window.addEventListener("load", handleLoad);

//     return () => window.removeEventListener("load", handleLoad);
//   });

//   const updateServiceWorker = () => {
//     PWASideEffectState.set("pending");
//     updatePWAServiceWorker(true);
//     setNeedRefresh(false);
//   };

//   const value: PWAProviderProps = {
//     needRefresh,
//     updateServiceWorker,
//   };

//   return (
//     <PWAProviderContext.Provider value={value}>
//       {children}
//     </PWAProviderContext.Provider>
//   );
// }

// export { PWAProvider, PWAProviderContext, PWASideEffectState };
