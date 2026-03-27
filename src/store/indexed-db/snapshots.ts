import { type EntityTable } from "dexie";
import type { AppStateType } from "../redux";
import { db } from ".";
import { incrementName } from "@/lib/utils";
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

export const SnapshotErrors = {
  NameAlreadyExists: "NAME_ALREADY_EXISTS",
} as const;

type SnapshotTableType = {
  snapshots: EntityTable<SnapshotType, "id">;
};

const createSnapshot = async (state: AppStateType, name: string) => {
  const existingSnapshot = await getSnapshotByName(name);
  if (existingSnapshot) {
    throw new Error(`Snapshot with name '${name}' already exists!`, {
      cause: SnapshotErrors.NameAlreadyExists,
    });
  }

  const curDate = new Date();
  await db.snapshots.add({
    name,
    state,
    createdAt: curDate,
    updatedAt: curDate,
  });
};

const createSnapshots = async (
  snapshots: SnapshotType[],
  overrideDuplicates: boolean,
) => {
  const failedSnapshots: IFailedSnapshot[] = [];

  for (const snapshot of snapshots) {
    while (true) {
      try {
        await snapshotOps.create(snapshot.state, snapshot.name);
        break;
      } catch (error) {
        const failedSnapshot: IFailedSnapshot = { ...snapshot };
        if (error instanceof Error) {
          failedSnapshot.cause = error.cause;
          if (error.cause === SnapshotErrors.NameAlreadyExists) {
            if (overrideDuplicates) await deleteSnapshotByName(snapshot.name);
            else snapshot.name = incrementName(snapshot.name);
            continue;
          }
        }

        failedSnapshot.error = `${error}`;
        failedSnapshots.push(failedSnapshot);
        break;
      }
    }
  }
};

const getSnapshotByName = async (name: string) => {
  return await db.snapshots.where("name").equals(name).first();
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

const deleteSnapshotByName = async (name: string) => {
  await db.snapshots.where("name").equals(name).delete();
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
  createBulk: createSnapshots,
  read: getSnapshot,
  readWithName: getSnapshotByName,
  readAll: getSnapshots,
  update: updateSnapshot,
  delete: deleteSnapshot,
  deleteWithName: deleteSnapshotByName,
  deleteBulk: bulkDeleteSnapshots,
  deleteAll: deleteAllSnapshots,
};

export type { SnapshotType, SnapshotTableType };
export { snapshotOps };
