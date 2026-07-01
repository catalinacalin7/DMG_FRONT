"use client";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

export type FormProps<T extends FieldValues> = {
  id?: string | undefined;
  form: UseFormReturn<T>;
  children: React.ReactNode;
  onSubmit?: SubmitHandler<T> | undefined;
};

const Form = <T extends FieldValues>(props: FormProps<T>) => {
  const { id, form, children, onSubmit } = props;

  const { handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <form id={id} onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}>
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
