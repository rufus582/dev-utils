import Dexie from "dexie";
import { type SnapshotTableType } from "./snapshots";

const db = new Dexie("DevUtilsDB") as Dexie & SnapshotTableType

db.version(1.1).stores({
  snapshots: "++id, name, state, createdAt, updatedAt",
});

export { db }
