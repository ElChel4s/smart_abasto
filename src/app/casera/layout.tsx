import type { Metadata } from "next";
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Portal de Abasto - Caseras",
  description: "Actualiza tu inventario por voz con IA y conecta con tus clientes.",
  manifest: "/manifest-casera.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Abasto Caseras",
  },
  icons: {
    apple: "https://api.dicebear.com/7.x/notionists/png?seed=AbastoCaseras&backgroundColor=d32f2f",
  },
};

export default function CaseraLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
