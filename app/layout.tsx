import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "Capacita COA",
  description: "Portal de Capacitação Operacional do COA",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const themeScript=`(()=>{try{const t=localStorage.getItem("capacita-theme")||"system";const dark=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);document.documentElement.dataset.theme=t}catch{}})();`;
  return <html lang="pt-BR" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body><ThemeProvider>{children}</ThemeProvider></body></html>;
}
