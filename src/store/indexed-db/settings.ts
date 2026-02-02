import { type EntityTable, type InsertType, type UpdateSpec } from "dexie";
import { db } from ".";

interface ISettings {
  id: number;
  pageTransition: boolean;
  theme: "light" | "dark" | "system";
}

type SettingsTableType = {
  settings: EntityTable<ISettings, "id">;
};

type SettingsTableInsertType = InsertType<ISettings, "id">;

const defaultSettings: SettingsTableInsertType = {
  pageTransition: false,
  theme: "system",
};

const updateSettings = async (
  settings: UpdateSpec<SettingsTableInsertType>
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

export type { ISettings, SettingsTableType };
export { settingsOps };
