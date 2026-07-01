import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

type PanelCommentProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
};

function EstimatePanelComment({ fieldName, fieldLabel }: PanelCommentProps) {
  const { control, watch } = useFormContext();

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="text-nowrap text-[16px] font-semibold lg:pr-14">
            {fieldLabel}
          </FormLabel>

          <div className="w-full">
            <FormControl className="w-full">
              <Textarea placeholder="" className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
export default EstimatePanelComment;
