"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme="light"|"dark"|"system";
type ThemeContextValue={theme:Theme;resolvedTheme:"light"|"dark";setTheme:(theme:Theme)=>void};
const ThemeContext=createContext<ThemeContextValue|undefined>(undefined);

export function ThemeProvider({children}:{children:React.ReactNode}){
  const [theme,setThemeState]=useState<Theme>("system");
  const [systemDark,setSystemDark]=useState(false);

  useEffect(()=>{
    const media=window.matchMedia("(prefers-color-scheme: dark)");
    const update=()=>setSystemDark(media.matches);
    update();
    setThemeState((localStorage.getItem("capacita-theme") as Theme|null)||"system");
    media.addEventListener("change",update);
    return ()=>media.removeEventListener("change",update);
  },[]);

  const resolvedTheme=theme==="system"?(systemDark?"dark":"light"):theme;
  useEffect(()=>{
    document.documentElement.classList.toggle("dark",resolvedTheme==="dark");
    document.documentElement.dataset.theme=theme;
    document.documentElement.style.colorScheme=resolvedTheme;
  },[theme,resolvedTheme]);

  function setTheme(next:Theme){setThemeState(next);localStorage.setItem("capacita-theme",next);}
  const value=useMemo(()=>({theme,resolvedTheme,setTheme}),[theme,resolvedTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(){
  const context=useContext(ThemeContext);
  if(!context)throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  return context;
}
