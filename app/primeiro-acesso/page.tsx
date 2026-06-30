"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ClealcoLogo } from "@/components/brand/ClealcoLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function FirstAccessForm(){
  const router=useRouter();const params=useSearchParams();const token=params.get("token")||"";
  const [profile,setProfile]=useState<{name:string;email:string}|null>(null);
  const [cracha,setCracha]=useState("");const [password,setPassword]=useState("");const [confirmation,setConfirmation]=useState("");
  const [message,setMessage]=useState("Validando seu convite...");const [loading,setLoading]=useState(false);
  useEffect(()=>{fetch(`/api/auth/first-access?token=${encodeURIComponent(token)}`).then(async response=>{const data=await response.json();if(response.ok){setProfile(data);setMessage("");}else setMessage(data.error);});},[token]);
  async function submit(event:React.FormEvent){
    event.preventDefault();setLoading(true);setMessage("");
    const response=await fetch("/api/auth/first-access",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,cracha,password,confirmation})});
    const data=await response.json();if(response.ok){router.replace("/dashboard");return;}setMessage(data.error);setLoading(false);
  }
  return <div className="card w-full max-w-lg p-7 sm:p-9"><span className="logo-surface inline-flex rounded-sm px-2 py-1.5"><ClealcoLogo className="w-32"/></span><p className="eyebrow mt-8">Primeiro acesso</p><h1 className="mt-2 text-3xl font-black">Ative seu acesso</h1>
    {profile?<><p className="mt-3 text-sm text-gray-500">Olá, <b>{profile.name}</b>. Confirme seu crachá e crie uma senha pessoal para entrar no portal.</p><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-xs font-bold">Número do crachá<input className="field mt-2" value={cracha} onChange={e=>setCracha(e.target.value)} required/></label><label className="block text-xs font-bold">Nova senha<input type="password" className="field mt-2" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required/></label><label className="block text-xs font-bold">Confirmar senha<input type="password" className="field mt-2" value={confirmation} onChange={e=>setConfirmation(e.target.value)} minLength={8} required/></label><p className="text-xs text-gray-500">Use ao menos 8 caracteres, uma letra maiúscula e um número.</p>{message&&<p className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{message}</p>}<button disabled={loading} className="btn-primary w-full justify-center">{loading?"Ativando...":"Concluir primeiro acesso"}</button></form></>:<p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{message}</p>}
    <Link href="/login" className="mt-6 block text-center text-xs font-bold text-leaf">Voltar ao login</Link></div>;
}

export default function FirstAccessPage(){return <main className="theme-page relative grid min-h-screen place-items-center p-5"><ThemeToggle className="fixed right-4 top-4 z-30"/><Suspense fallback={<div>Carregando...</div>}><FirstAccessForm/></Suspense></main>;}
