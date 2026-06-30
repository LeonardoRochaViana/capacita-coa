"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ClealcoLogo } from "@/components/brand/ClealcoLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function RecoveryForm(){
  const token=useSearchParams().get("token")||"";
  const [identifier,setIdentifier]=useState("");const [password,setPassword]=useState("");const [confirmation,setConfirmation]=useState("");
  const [message,setMessage]=useState("");const [resetPath,setResetPath]=useState("");
  async function submit(event:React.FormEvent){
    event.preventDefault();const endpoint=token?"/api/auth/reset":"/api/auth/recover";
    const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(token?{token,password,confirmation}:{identifier})});
    const data=await response.json();setMessage(data.error||data.message||(response.ok?"Senha redefinida. Você já pode entrar.":"Não foi possível concluir."));setResetPath(data.resetPath||"");
  }
  return <div className="card w-full max-w-lg p-7 sm:p-9"><span className="logo-surface inline-flex rounded-sm px-2 py-1.5"><ClealcoLogo className="w-32"/></span><p className="eyebrow mt-8">Segurança de acesso</p><h1 className="mt-2 text-3xl font-black">{token?"Crie uma nova senha":"Recuperar senha"}</h1><p className="mt-3 text-sm text-gray-500">{token?"Defina sua nova credencial pessoal.":"Informe seu e-mail, crachá ou matrícula para solicitar a recuperação."}</p><form onSubmit={submit} className="mt-7 space-y-4">{token?<><label className="block text-xs font-bold">Nova senha<input type="password" className="field mt-2" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required/></label><label className="block text-xs font-bold">Confirmar senha<input type="password" className="field mt-2" value={confirmation} onChange={e=>setConfirmation(e.target.value)} required/></label></>:<label className="block text-xs font-bold">E-mail, crachá ou matrícula<input className="field mt-2" value={identifier} onChange={e=>setIdentifier(e.target.value)} required/></label>}<button className="btn-primary w-full justify-center">{token?"Salvar nova senha":"Solicitar recuperação"}</button></form>{message&&<p className="mt-5 rounded-xl bg-mist p-4 text-xs leading-5 text-gray-600">{message}</p>}{resetPath&&<Link className="mt-4 block rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-bold text-leaf" href={resetPath}>Abrir link de recuperação local</Link>}<Link href="/login" className="mt-6 block text-center text-xs font-bold text-leaf">Voltar ao login</Link></div>;
}

export default function RecoveryPage(){return <main className="theme-page relative grid min-h-screen place-items-center p-5"><ThemeToggle className="fixed right-4 top-4 z-30"/><Suspense fallback={<div>Carregando...</div>}><RecoveryForm/></Suspense></main>;}
