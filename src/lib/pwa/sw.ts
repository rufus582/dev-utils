import {
  CacheFirst,
  ExpirationPlugin,
  type PrecacheEntry,
  type RuntimeCaching,
  Serwist,
} from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: PrecacheEntry[];
};

const runtimeCaching: RuntimeCaching[] = [
  {
    matcher: /\.wasm$/,
    handler: new CacheFirst({
      cacheName: "wasm-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 10,
        }),
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  runtimeCaching,
});

serwist.addEventListeners();
