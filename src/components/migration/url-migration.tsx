import { getCurrentEnvironment, openLinkInNewTab, sleep } from "@/lib/utils";
import { snapshotOps } from "@/store/indexed-db/snapshots";
import { useLiveQuery } from "dexie-react-hooks";
import _ from "lodash";
import { useEffect, useEffectEvent, useRef } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { customAlphabet } from "nanoid";
import { useSearchParams } from "react-router";
import { ImportSnapshotsForm } from "../pages/SnapshotsPage/ImportSnapshotsForm";

/**
 * @file This file contains logic for the UX for migrating from the old URL (dev-utils-rufus.vercel.app) to the new URL (dev-utils.rufus582.dev).
 * @example
 * import * as URLMigration from "@/components/migration/url-migration";
 *
 * <URLMigration.ExportSnapshotsAndRedirect />
 * <URLMigration.ImportSnapshotsBasedOnParams />
 */

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

const ExportSnapshotsAndRedirect = () => {
  const [searchParams] = useSearchParams();

  const snapshots = useLiveQuery(snapshotOps.readAll);
  const redirectToNewUrl = (hasSnapshots?: boolean) => {
    const queryParams = hasSnapshots ? "&importSnapshots=true" : "";
    openLinkInNewTab(
      getCurrentEnvironment() === "production"
        ? "https://dev-utils.rufus582.dev?oldUrlRedirect=true" + queryParams
        : "https://dev-utils-beta.rufus582.dev?oldUrlRedirect=true" +
            queryParams,
    );
  };

  const exportAnchorRef = useRef<HTMLAnchorElement>(null);
  const onExportClick = useEffectEvent(async () => {
    if (exportAnchorRef.current && snapshots) {
      const stringifiedSnapshots = JSON.stringify(snapshots, undefined, "");
      exportAnchorRef.current.download = `DevUtilsBackup_${Intl.DateTimeFormat().format()}_${nanoid()}.dvubak`;
      exportAnchorRef.current.href = `data:text/json;charset=utf-8,${encodeURIComponent(stringifiedSnapshots)}`;
      exportAnchorRef.current.click();

      return true;
    }
    return false;
  });

  useEffect(() => {
    if (searchParams.get("oldUrlRedirect") === "true") return;
    if (!_.endsWith(window.location.host, "rufus582.dev") && snapshots) {
      const handleMigration = async () => {
        await sleep(4000);
        toast.dismiss();
        await sleep(1000);
        const toastId = toast.info(
          <p className="select-none font-bold">
            Dev-Utils. is moving to a new URL!
          </p>,
          {
            description: snapshots.length
              ? "Clicking on the Migrate button will export your saved snapshots and redirect you to the new URL."
              : "Clicking on the Migrate button will redirect you to the new URL.",
            duration: 100 * 1000,
            action: (
              <Button
                variant="outline"
                size="sm"
                className="hover:text-current rounded-3xl"
                onClick={async () => {
                  toast.dismiss(toastId);
                  if (snapshots.length) await onExportClick();
                  redirectToNewUrl(snapshots.length ? true : false);
                }}
              >
                Migrate
              </Button>
            ),
          },
        );
      };
      handleMigration();
    }
  }, [snapshots, searchParams]);

  return <a ref={exportAnchorRef} className="hidden" />;
};

const ImportSnapshotsBasedOnParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toastId = useRef<number | string>("");

  useEffect(() => {
    if (!_.endsWith(window.location.host, "rufus582.dev")) setSearchParams("");
  }, [setSearchParams]);

  useEffect(() => {
    if (
      searchParams.get("oldUrlRedirect") === "true" &&
      _.endsWith(window.location.host, "rufus582.dev")
    ) {
      if (searchParams.get("importSnapshots") === "true") {
        toast.dismiss();
        toastId.current = toast.info(
          <span className="font-bold">Migration almost complete!</span>,
          {
            description:
              "One final step - open the file that was downloaded and click on the Import button to complete.",
            duration: 100 * 1000,
            closeButton: false,
          },
        );
      } else {
        if (toastId.current) toast.dismiss(toastId.current);
        toast.success(
          <span className="font-bold">Migration completed successfully!</span>,
          {
            description: "Update your bookmarks with this URL.",
            duration: 7000,
            onAutoClose() {
              setSearchParams("");
            },
            onDismiss() {
              setSearchParams("");
            },
          },
        );
      }
    } else if (toastId.current) toast.dismiss(toastId.current);
  }, [searchParams]);

  return (
    <ImportSnapshotsForm
      open={
        searchParams.get("oldUrlRedirect") === "true" &&
        searchParams.get("importSnapshots") === "true" &&
        _.endsWith(window.location.host, "rufus582.dev")
      }
      interactionOutside={false}
      showCloseButton={false}
      successMessage={() => {
        setSearchParams("?oldUrlRedirect=true");
      }}
      onCancel={() => {
        setSearchParams("");
        toast.warning(
          <span className="font-bold">Migration was cancelled</span>,
          {
            description:
              "Go to Saved Snapshots and import the downloaded file to complete.",
          },
        );
      }}
    />
  );
};

export { ExportSnapshotsAndRedirect, ImportSnapshotsBasedOnParams };
