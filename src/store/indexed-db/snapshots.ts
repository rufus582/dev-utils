import { type EntityTable } from "dexie";
import type { AppStateType } from "../redux";
import { db } from ".";
import z from "zod";
import { appStateSchema } from "../redux/root-reducer";

export const snapshotSchema = z.object({
  id: z.number(),
  name: z.string(),
  state: appStateSchema,
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

type SnapshotType = z.output<typeof snapshotSchema>

interface IFailedSnapshot extends SnapshotType {
  error?: string;
  cause?: unknown;
}

type SnapshotTableType = {
  snapshots: EntityTable<SnapshotType, "id">;
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

export type { SnapshotType, SnapshotTableType };
export { snapshotOps };
