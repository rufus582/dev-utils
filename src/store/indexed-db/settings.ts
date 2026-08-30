import type { EntityTable, InsertType, UpdateSpec } from "dexie";
import z from "zod";
import { db } from ".";

export const settingsSchema = z.object({
  id: z.number(),
  pageTransition: z.boolean().optional(),
  theme: z.literal(["light", "dark", "system"]),
  aiProviderId: z.string().optional(),
  aiModelId: z.string().optional(),
});

type SettingsType = z.output<typeof settingsSchema>;

type SettingsTableType = {
  settings: EntityTable<SettingsType, "id">;
};

type SettingsTableInsertType = InsertType<SettingsType, "id">;

const defaultSettings: SettingsTableInsertType = {
  pageTransition: false,
  theme: "system",
  aiProviderId: undefined,
  aiModelId: undefined,
};

const updateSettings = async (
  settings: UpdateSpec<SettingsTableInsertType>,
) => {
  const fetchedSettings = await createAndGetSettings();
  if (fetchedSettings.id)
    await db.settings.update(fetchedSettings.id, settings);
  else throw new Error("Unable to update settings!");
};

const createAndGetSettings = async () => {
  const settings = await getSettings();
  if (settings.id) return settings;
  await db.settings.add(defaultSettings);
  return defaultSettings;
};

const getSettings = async () => {
  const settings = await db.settings.toArray();
  if (settings.length === 0) {
    return defaultSettings;
  }

  return settings[0];
};

const settingsOps = {
  get: getSettings,
  createAndGet: createAndGetSettings,
  update: updateSettings,
};

export type { SettingsTableInsertType, SettingsTableType, SettingsType };
export { settingsOps };
