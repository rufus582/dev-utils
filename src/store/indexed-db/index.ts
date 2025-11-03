import Dexie from "dexie";
import { type SnapshotTableType } from "./snapshots";
import type { SettingsTableType } from "./settings";

const db = new Dexie("DevUtilsDB") as Dexie &
  SnapshotTableType &
  SettingsTableType;

db.version(1.1).stores({
  snapshots: "++id, name, state, createdAt, updatedAt",
  settings: "++id, pageTransition, theme",
});

export { db };
