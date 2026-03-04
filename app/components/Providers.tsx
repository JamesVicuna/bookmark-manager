import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export const Providers = ({ children }: { children: ReactNode }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};
