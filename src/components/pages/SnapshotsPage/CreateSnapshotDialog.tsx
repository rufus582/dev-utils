import { InfoIcon, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Button as AnimatedButton } from "@/components/ui/custom-components/animated-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRef, useState, type ReactNode } from "react";
import { useStore } from "react-redux";
import type { AppStateType } from "@/store/redux";
import { Separator } from "@/components/ui/separator";
import { snapshotOps } from "@/store/indexed-db/snapshots";
import { toast } from "sonner";

interface ICreateSnapshotDialogProps {
  trigger: ReactNode;
}

const CreateSnapshotDialog = ({ trigger }: ICreateSnapshotDialogProps) => {
  const store = useStore<AppStateType>();
  const currentAppState = store.getState();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const createSnapshotFormRef = useRef<HTMLFormElement>(null);
  const handleSaveSnapshot = async (): Promise<boolean> => {
    const formData = new FormData(createSnapshotFormRef.current ?? undefined);
    const formResponse = Object.fromEntries(formData.entries()) as unknown as {
      name: string;
    };

    if (formResponse.name === "") {
      toast.error("Cannot save app state with empty name.");
      return false;
    }

    try {
      await snapshotOps.create(currentAppState, formResponse.name);

      toast.success(`Successfully saved current app state.`);
      setIsFormOpen(false);
      return true;
    } catch (error) {
      toast.error(`${error}`);
      return false;
    }
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={(open) => setIsFormOpen(open)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent bgBlur>
        <DialogHeader>
          <DialogTitle>Create Snapshot</DialogTitle>
          <DialogDescription>
            Save a snapshot of the data from all pages.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={createSnapshotFormRef}
          onSubmit={(ev) => {
            ev.preventDefault();
          }}
        >
          <div className="grid grid-cols-5 gap-4">
            <Alert className="col-span-5 rounded-xl">
              <InfoIcon />
              <AlertDescription>
                Data from SQL Playground cannot be saved!
              </AlertDescription>
            </Alert>
            <Separator className="col-span-5" />
            <Label htmlFor="name">Name</Label>
            <Input
              required
              id="name"
              name="name"
              type="text"
              className="rounded-full col-span-5 hover:border-muted-foreground transition-colors"
              placeholder="Any name of your choice to use when saving app state"
            />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-full" type="button">
                Cancel
              </Button>
            </DialogClose>
            <AnimatedButton
              type="submit"
              buttonIcon={<SaveIcon />}
              className="rounded-full"
              onClick={handleSaveSnapshot}
              whileHover={{ scale: 1.1 }}
            >
              Save
            </AnimatedButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSnapshotDialog;
