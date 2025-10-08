import { type EntityTable } from "dexie";
import type { AppStateType } from "../redux";
import { db } from ".";

interface ISnapshot {
  id: number;
  name: string;
  state: AppStateType;
  createdAt: Date;
  updatedAt: Date;
}

type SnapshotTableType = {
  snapshots: EntityTable<ISnapshot, "id">;
};

const createSnapshot = async (state: AppStateType, name: string) => {
  const existingSnapshot = await db.snapshots
    .where("name")
    .equals(name)
    .first();
  if (existingSnapshot) {
    throw new Error(`Saved State with name '${name}' already exists!`);
  }

  const curDate = new Date();
  await db.snapshots.add({
    name,
    state,
    createdAt: curDate,
    updatedAt: curDate,
  });
};

const getSnapshot = async (id: number) => {
  return await db.snapshots.get(id);
};

const getSnapshots = async () => {
  return await db.snapshots.toArray();
};

const updateSnapshot = async (id: number, state: AppStateType) => {
  await db.snapshots.update(id, {
    state,
    updatedAt: new Date(),
  });
};

const deleteSnapshot = async (id: number) => {
  await db.snapshots.delete(id);
};

const bulkDeleteSnapshots = async (idList: number[]) => {
  await db.snapshots.bulkDelete(idList);
};

const deleteAllSnapshots = async () => {
  await db.snapshots.clear();
};

const snapshotOps = {
  create: createSnapshot,
  read: getSnapshot,
  readAll: getSnapshots,
  update: updateSnapshot,
  delete: deleteSnapshot,
  deleteBulk: bulkDeleteSnapshots,
  deleteAll: deleteAllSnapshots,
};

export type { ISnapshot, SnapshotTableType };
export { snapshotOps };
