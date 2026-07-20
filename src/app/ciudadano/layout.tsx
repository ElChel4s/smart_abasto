import type { Metadata } from "next";
import { ReactNode } from 'react';
import CiudadanoProviders from "./providers";

export const metadata: Metadata = {
  title: "Portal de Abasto - Ciudadano",
  description: "Busca precios justos, mercados abiertos y exige Peso Fiel en La Paz.",
  manifest: "/manifest-ciudadano.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Abasto Ciudadano",
  },
  icons: {
    apple: "https://api.dicebear.com/7.x/notionists/png?seed=AbastoCiudadano&backgroundColor=388e3c",
  },
};

export default function CiudadanoLayout({ children }: { children: ReactNode }) {
  return <CiudadanoProviders>{children}</CiudadanoProviders>;
}
