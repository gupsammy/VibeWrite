"use client";

import { DeepgramProvider } from "@/lib/contexts/DeepgramContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DeepgramProvider>{children}</DeepgramProvider>
    </AuthProvider>
  );
}
