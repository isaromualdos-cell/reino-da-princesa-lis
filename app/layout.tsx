import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "O Reino da Princesa Lis",
  description: "Câmera do primeiro aniversário da Lis",
  icons: { icon: "/royaume/crest.webp" },
};

export const viewport: Viewport = { viewportFit: "cover", themeColor: "#f7eee6" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}