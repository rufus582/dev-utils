import { createContext } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const SW_REFRESH_INTERVAL_MS = parseInt(
  import.meta.env.DEVUTILS_SW_REFRESH_INTERVAL_MS || "600000",
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

function PWAProvider({ children }: { children: React.ReactNode }) {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker: updatePWAServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_, registration) {
      setInterval(() => {
        registration?.update();
      }, SW_REFRESH_INTERVAL_MS);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const updateServiceWorker = () => {
    updatePWAServiceWorker(true);
    setNeedRefresh(false);
  };

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

export { PWAProviderContext, PWAProvider };
