import { getSerwist } from "virtual:serwist";
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
    serwistRef.current?.messageSkipWaiting();
    setNeedRefresh(false);
  }, []);

  useEffect(() => {
    let windowTimeout: number | undefined;

    const openUpdateWindow = () => {
      canUpdatePWA.current = true;
      windowTimeout = window.setTimeout(() => {
        canUpdatePWA.current = false;
      }, SW_UPDATE_WINDOW_MS);
    };

    window.addEventListener("load", openUpdateWindow, { once: true });

    return () => {
      if (windowTimeout) window.clearTimeout(windowTimeout);
      window.removeEventListener("load", openUpdateWindow);
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let updateInterval: number | undefined;

    const loadSerwist = async () => {
      const serwist = await getSerwist();
      serwistRef.current = serwist;

      serwist?.addEventListener("waiting", () => {
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

      serwist?.addEventListener("controlling", () => {
        window.location.reload();
      });

      void serwist?.register().then(() => {
        updateInterval = window.setInterval(
          () => void serwist.update(),
          SW_REFRESH_INTERVAL_MS,
        );
      });
    };

    loadSerwist().catch((error) => console.log("SW registration error", error));

    return () => {
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

export { PWAProvider, PWAProviderContext, usePWA };
