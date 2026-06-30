"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/components/theme/ThemeProvider";

const nextTheme:Record<Theme,Theme>={system:"light",light:"dark",dark:"system"};
const labels:Record<Theme,string>={system:"Tema: sistema",light:"Tema: claro",dark:"Tema: escuro"};

export function ThemeToggle({className=""}:{className?:string}){
  const {theme,resolvedTheme,setTheme}=useTheme();
  const Icon=theme==="system"?Monitor:resolvedTheme==="dark"?Moon:Sun;
  return <button type="button" aria-label={`${labels[theme]}. Alterar tema`} title={`${labels[theme]} — clique para alterar`} onClick={()=>setTheme(nextTheme[theme])} className={`grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink transition hover:border-leaf hover:text-leaf dark:border-[#34343a] dark:bg-[#202024] dark:text-gray-200 ${className}`}><Icon size={18}/></button>;
}
