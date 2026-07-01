import React from "react";

type FormInputWrapperProps = {
  children: React.ReactNode;
};

const FormInputWrapper = ({ children }: FormInputWrapperProps) => {
  return <div className="w-full py-1 lg:py-4">{children}</div>;
};

export default FormInputWrapper;
