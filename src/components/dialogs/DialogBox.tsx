import { Button } from "@/components/ui/button";
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
import { useTranslations } from "next-intl";

type DialogBoxProps = {
  dialogTriggerName?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  actionLabel?: string;
  cancelLabel?: string;
  onAction: () => void;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  triggerIcon?: React.ReactNode;
  triggerVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  triggerClassname?: string;
  triggerSize?: "default" | "sm" | "lg" | "icon";
};

function DialogBox({
  dialogTriggerName,
  dialogTitle,
  dialogDescription,
  onAction,
  actionLabel = "delete",
  cancelLabel = "cancel",
  open,
  onOpenChange,
  triggerIcon,
  triggerVariant,
  triggerClassname,
  triggerSize = "sm",
}: DialogBoxProps) {
  const tUI = useTranslations("ui");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={triggerClassname}
          variant={triggerVariant}
          size={triggerSize}
        >
          {triggerIcon ?? dialogTriggerName}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">{dialogTitle}</DialogTitle>
          <DialogDescription className="py-6 text-center text-base">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row items-center justify-center gap-2 py-8 sm:flex sm:justify-center">
          <DialogClose asChild>
            <Button type="button" variant={"secondary"} size={"sm"}>
              {tUI(`buttons.${cancelLabel}`)}
            </Button>
          </DialogClose>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAction(), onOpenChange(false);
            }}
            variant={"destructive"}
            size={"sm"}
            className="bg-red-500"
          >
            {tUI(`buttons.${actionLabel}`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DialogBox;
