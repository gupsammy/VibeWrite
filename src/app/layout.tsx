import "./globals.css";
import { DeepgramContextProvider } from "@/lib/contexts/DeepgramContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DeepgramContextProvider>{children}</DeepgramContextProvider>
      </body>
    </html>
  );
}
