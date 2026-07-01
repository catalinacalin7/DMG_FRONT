import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estimate Master",
};

const HomePage = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children}</>;
};

export default HomePage;
