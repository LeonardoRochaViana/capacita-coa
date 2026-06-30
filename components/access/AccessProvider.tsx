"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AccessUser } from "@/types";

type AccessContextValue = {
  user: AccessUser;
  loading: boolean;
  refreshSession: () => Promise<void>;
};

const fallbackUser:AccessUser={id:"",nome:"",email:"",perfil:"Aluno",mesa:"",unidade:"",turno:""};
const AccessContext = createContext<AccessContextValue | null>(null);

export function AccessProvider({children}:{children:React.ReactNode}){
  const [user,setUser]=useState<AccessUser>(fallbackUser);
  const [loading,setLoading]=useState(true);
  async function refreshSession(){
    const response=await fetch("/api/session",{cache:"no-store"});
    if(!response.ok){window.location.replace("/login");return;}
    const data=await response.json() as {user:AccessUser};
    setUser(data.user);setLoading(false);
  }
  useEffect(()=>{void refreshSession();},[]);
  return <AccessContext.Provider value={{user,loading,refreshSession}}>{loading?<div className="theme-page grid min-h-screen place-items-center text-sm font-semibold text-gray-500 dark:text-gray-300">Validando acesso...</div>:children}</AccessContext.Provider>;
}

export function useAccess(){
  const context=useContext(AccessContext);
  if(!context)throw new Error("useAccess deve ser usado dentro de AccessProvider");
  return context;
}

export function AccessRestricted({area}:{area:string}){
  return <div className="card mx-auto max-w-xl p-8 text-center"><p className="eyebrow">Acesso restrito</p><h1 className="mt-3 text-2xl font-bold">{area}</h1><p className="mt-3 text-sm leading-6 text-gray-500">Seu perfil não possui permissão para acessar esta área. Se necessário, solicite apoio ao administrador do portal.</p></div>;
}
