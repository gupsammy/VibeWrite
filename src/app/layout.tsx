import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-60px)]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
