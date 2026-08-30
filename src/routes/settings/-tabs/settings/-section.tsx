import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import {
  type SettingsTableInsertType,
  settingsOps,
} from "#store/indexed-db/settings.ts";
import { Skeleton } from "#ui/skeleton";

type SettingsSectionProps<T> = Omit<
  React.ComponentProps<"section">,
  "children"
> & {
  title: string;
  fieldsCount: number;
  children:
    | ((
        settings: T,
        onSettingChanged: (newSettings: Partial<T>) => void,
      ) => React.ReactNode)
    | React.ReactNode;
};

const SettingsSkeleton = ({ fieldsCount = 2 }: { fieldsCount?: number }) => {
  return (
    <div className="flex flex-col gap-8 w-full">
      {Array.from({ length: fieldsCount }).map((_, index) => (
        <div className="flex gap-4 justify-between" key={index}>
          <div className="flex flex-col gap-2 w-1/2">
            <Skeleton className="h-5 my-auto w-1/4 rounded-full" />
            <Skeleton className="h-5 my-auto w-1/2 rounded-full" />
          </div>
          <Skeleton className="my-auto h-8 w-[15%] rounded-full self-end" />
        </div>
      ))}
    </div>
  );
};

export default function SettingsSection({
  title,
  children,
  fieldsCount,
  ...props
}: SettingsSectionProps<SettingsTableInsertType>) {
  const settings = useLiveQuery(settingsOps.get);

  const onSettingChanged = async (newSettings: Partial<typeof settings>) => {
    try {
      await settingsOps.update({
        ...settings,
        ...newSettings,
      });
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <section {...props}>
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      {typeof children === "function" && settings ? (
        <div className="flex flex-col gap-4">
          {children(settings, onSettingChanged)}
        </div>
      ) : typeof children === "object" ? (
        <div>{children}</div>
      ) : (
        <SettingsSkeleton fieldsCount={fieldsCount} />
      )}
    </section>
  );
}
