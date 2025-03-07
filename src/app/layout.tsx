import "./globals.css";
import { DeepgramProvider } from "@/lib/contexts/DeepgramContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DeepgramProvider>{children}</DeepgramProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
