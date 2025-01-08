"use client";

import { TanstackProvider } from "@/providers/tanstak.provider";
import { ToastifyProvider } from "@/providers/toastify.provider";

export const AppProviders: React.FC<IChildren> = ({ children }) => {
  return (
    <TanstackProvider>
      <ToastifyProvider>{children}</ToastifyProvider>
    </TanstackProvider>
  );
};
