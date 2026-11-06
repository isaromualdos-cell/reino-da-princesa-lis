import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Reino da Princesa Lis",description:"Fotos do primeiro aniversário da Lis"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}