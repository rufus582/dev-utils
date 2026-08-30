import Dexie from "dexie";
import type { SettingsTableType } from "./settings";
import type { SnapshotTableType } from "./snapshots";

const db = new Dexie("DevUtilsDB") as Dexie &
  SnapshotTableType &
  SettingsTableType;

db.version(1.1).stores({
  snapshots: "++id, name, state, createdAt, updatedAt",
  settings: "++id, pageTransition, theme",
});

db.version(1.2).stores({
  snapshots: "++id, name, state, createdAt, updatedAt",
  settings: "++id, pageTransition, theme, aiProviderId, aiModelId",
});

export { db };
