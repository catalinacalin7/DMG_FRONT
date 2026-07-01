import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflow",
};

const WorkflowLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children}</>;
};

export default WorkflowLayout;
