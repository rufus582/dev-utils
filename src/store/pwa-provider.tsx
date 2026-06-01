import type { Serwist as SerwistWindow } from "@serwist/window";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useTimeout } from "@/hooks/use-timeout";

const SW_REFRESH_INTERVAL_MS = parseInt(
  import.meta.env.DEVUTILS_SW_REFRESH_INTERVAL_MS || "1000",
  10,
);

const SW_UPDATE_WINDOW_MS = parseInt(
  import.meta.env.DEVUTILS_SW_UPDATE_ON_LOAD_WINDOW_MS || "10000",
  10,
);

type PWASideEffectStateType = "pending" | "completed";

const PWASideEffectState = {
  get: () =>
    (localStorage.getItem("pwa-side-effect-state") ??
      "pending") as PWASideEffectStateType,
  set: (state: PWASideEffectStateType) =>
    localStorage.setItem("pwa-side-effect-state", state),
};

interface PWAProviderProps {
  needRefresh: boolean;
  updateServiceWorker: () => void;
}

const initialState: PWAProviderProps = {
  needRefresh: false,
  updateServiceWorker: () => null,
};

const PWAProviderContext = createContext<PWAProviderProps>(initialState);

const AutoUpdatePWAToast = ({
  initialSeconds,
  onComplete,
}: {
  initialSeconds: number;
  onComplete: () => void;
}) => {
  const { remainingSeconds } = useTimeout({
    initialTimeout: initialSeconds,
    onTimeout: onComplete,
  });

  return (
    <div>New content available. Updating in {remainingSeconds} seconds...</div>
  );
};

function PWAProvider({ children }: { children: React.ReactNode }) {
  const canUpdatePWA = useRef(false);
  const serwistRef = useRef<SerwistWindow | undefined>(undefined);
  const [needRefresh, setNeedRefresh] = useState(false);

  const updateServiceWorker = useCallback(() => {
    PWASideEffectState.set("pending");
    serwistRef.current?.messageSkipWaiting();
    setNeedRefresh(false);
  }, []);

  useEffect(() => {
    const handleLoad = async () => {
      canUpdatePWA.current = true;
      window.setTimeout(() => {
        canUpdatePWA.current = false;
      }, SW_UPDATE_WINDOW_MS);
    };

    window.addEventListener("load", handleLoad);

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let isMounted = true;
    let updateInterval: number | undefined;

    void import("@serwist/window")
      .then(({ Serwist }) => {
        if (!isMounted) return;

        const serwist = new Serwist("/sw.js", { scope: "/" });
        serwistRef.current = serwist;

        const checkForUpdates = () => {
          void serwist.update();
        };

        serwist.addEventListener("waiting", () => {
          setNeedRefresh(true);

          if (canUpdatePWA.current) {
            const toastId = toast.loading(
              <AutoUpdatePWAToast
                initialSeconds={5}
                onComplete={() => {
                  updateServiceWorker();
                  canUpdatePWA.current = false;
                  toast.dismiss(toastId);
                }}
              />,
            );
          }
        });

        serwist.addEventListener("controlling", () => {
          window.location.reload();
        });

        return serwist.register().then(() => {
          checkForUpdates();
          updateInterval = window.setInterval(
            checkForUpdates,
            SW_REFRESH_INTERVAL_MS,
          );
        });
      })
      .catch((error: unknown) => {
        console.log("SW registration error", error);
      });

    return () => {
      isMounted = false;
      if (updateInterval) window.clearInterval(updateInterval);
      serwistRef.current = undefined;
    };
  }, [updateServiceWorker]);

  const value: PWAProviderProps = {
    needRefresh,
    updateServiceWorker,
  };

  return (
    <PWAProviderContext.Provider value={value}>
      {children}
    </PWAProviderContext.Provider>
  );
}

const usePWA = () => {
  const context = useContext(PWAProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a PWAProvider");

  return context;
};

export { PWAProvider, PWAProviderContext, PWASideEffectState, usePWA };
