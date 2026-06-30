"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAccess } from "@/components/access/AccessProvider";
import type { AccessUser, Aula, DDD, Fluxograma, ITProcedimento, Mesa, Trilha, UserTablePermission } from "@/types";
import { AlertTriangle, BookOpen, CheckCircle2, FileText, LockKeyhole, MessageSquareText, TrendingUp, Workflow } from "lucide-react";
import Link from "next/link";

type PermissionResponse={permissions:UserTablePermission[];mesas:Mesa[];users:AccessUser[];role:string};
type ContentResponse={mesa:Mesa;aulas:Aula[];its:ITProcedimento[];fluxos:Fluxograma[];ddds:DDD[];trilha:Trilha|null;error?:string};

export default function MinhaMesaAuthorized(){
  const {user}=useAccess();
  const [allowed,setAllowed]=useState<Mesa[]>([]);
  const [selected,setSelected]=useState("");
  const [content,setContent]=useState<ContentResponse|null>(null);
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(true);
  const summaries:Array<[React.ElementType,string,number]>=[
    [FileText,"ITs e Procedimentos",content?.its.length||0],
    [Workflow,"Fluxogramas",content?.fluxos.length||0],
    [MessageSquareText,"DDDs recentes",content?.ddds.length||0],
  ];

  useEffect(()=>{
    setLoading(true);setMessage("");setContent(null);
    fetch("/api/mesa-permissions").then(response=>response.json()).then((data:PermissionResponse)=>{
      const mesas=user.perfil==="Aluno"
        ? data.mesas.filter(mesa=>data.permissions.some(permission=>permission.user_id===user.id&&permission.mesa_id===mesa.id&&(permission.status==="liberado"||permission.status==="concluido")))
        : data.mesas;
      setAllowed(mesas);
      const requested=new URLSearchParams(window.location.search).get("mesa");
      if(user.perfil==="Aluno"&&requested&&!mesas.some(mesa=>mesa.id===requested)){
        setMessage("Acesso não autorizado. Esta mesa ainda não foi liberada para seu treinamento.");setLoading(false);return;
      }
      const first=requested&&mesas.some(mesa=>mesa.id===requested)?requested:mesas[0]?.id;
      if(!first){setMessage("Nenhuma mesa de treinamento foi liberada para você no momento. Procure seu gestor para mais informações.");setLoading(false);return;}
      setSelected(first);loadContent(first);
    }).catch(()=>{setMessage("Não foi possível validar suas permissões de treinamento.");setLoading(false);});
  },[user]);

  function loadContent(mesaId:string){
    setLoading(true);setMessage("");setContent(null);setSelected(mesaId);
    window.history.replaceState(null,"",`/minha-mesa?mesa=${mesaId}`);
    fetch(`/api/mesa-content?mesaId=${encodeURIComponent(mesaId)}`).then(async response=>{
      const data=await response.json();
      if(!response.ok)throw new Error(data.error);
      setContent(data);
    }).catch(error=>setMessage(error instanceof Error?error.message:"Acesso não autorizado.")).finally(()=>setLoading(false));
  }

  return <><PageHeader eyebrow="Área de treinamento" title="Minha Mesa" description={user.perfil==="Aluno"?"Acesse somente as operações liberadas pela sua liderança.":"Consulte as mesas e acompanhe os conteúdos disponíveis para capacitação."}/>
    {allowed.length>0&&<div className="mb-6 flex gap-2 overflow-x-auto pb-2">{allowed.map(mesa=><button key={mesa.id} onClick={()=>loadContent(mesa.id)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${selected===mesa.id?"border-leaf bg-leaf text-white":"border-line bg-white text-gray-500 hover:border-leaf"}`}>{mesa.short}</button>)}</div>}
    {loading&&<div className="card p-8 text-center text-sm text-gray-500">Validando permissões e carregando conteúdos...</div>}
    {!loading&&message&&<div className="card mx-auto max-w-2xl p-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-leaf"><LockKeyhole/></span><h2 className="mt-5 text-xl font-bold">{message.startsWith("Acesso não autorizado")?"Acesso não autorizado":"Treinamento aguardando liberação"}</h2><p className="mt-3 text-sm leading-6 text-gray-500">{message}</p></div>}
    {!loading&&content&&<><section className="card overflow-hidden"><div className="h-1.5 bg-leaf"/><div className="grid gap-8 p-6 lg:grid-cols-[1.25fr_.75fr] lg:p-8"><div><p className="eyebrow">Mesa autorizada</p><h2 className="mt-2 text-2xl font-bold">{content.mesa.nome}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">{content.mesa.descricao}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{content.mesa.responsabilidades.map(item=><div key={item} className="flex gap-2 text-sm"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-leaf"/>{item}</div>)}</div></div><div className="rounded-2xl bg-mist p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold">Progresso da trilha</span><b className="text-xl text-leaf">{content.trilha?.progresso||0}%</b></div><div className="mt-3 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-leaf" style={{width:`${content.trilha?.progresso||0}%`}}/></div><div className="mt-5 rounded-xl bg-white p-4"><b className="text-sm">{content.aulas.length} aulas disponíveis</b><p className="mt-1 text-xs text-gray-400">Conteúdo liberado para seu perfil.</p></div></div></div></section>
      <div className="mt-5 grid gap-5 lg:grid-cols-2"><section className="card p-5"><h3 className="mb-4 flex items-center gap-2 font-bold"><BookOpen size={18} className="text-leaf"/>Aulas operacionais</h3><div className="space-y-2">{content.aulas.length?content.aulas.slice(0,5).map(aula=><Link key={aula.id} href={`/aulas/${aula.id}`} className="flex items-center justify-between rounded-xl border border-line p-3 hover:border-leaf"><span><b className="block text-xs">{aula.titulo}</b><small className="text-gray-400">{aula.tempo} min · {aula.status}</small></span><BookOpen size={15} className="text-leaf"/></Link>):<p className="text-xs text-gray-400">Conteúdo em estruturação.</p>}</div></section><section className="card p-5"><h3 className="mb-4 flex items-center gap-2 font-bold"><TrendingUp size={18} className="text-leaf"/>Indicadores autorizados</h3><div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-mist p-4"><b className="text-xl">{content.its.length}</b><small className="block text-gray-400">ITs vinculadas</small></div><div className="rounded-xl bg-mist p-4"><b className="text-xl">{content.fluxos.length}</b><small className="block text-gray-400">Fluxogramas</small></div><div className="rounded-xl bg-mist p-4"><b className="text-xl">{content.ddds.length}</b><small className="block text-gray-400">DDDs recentes</small></div><div className="rounded-xl bg-mist p-4"><b className="text-xl">{content.trilha?.etapas.length||0}</b><small className="block text-gray-400">Etapas da trilha</small></div></div></section></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">{summaries.map(([Icon,label,count])=><div key={label} className="card flex items-center gap-4 p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-sprout"><Icon size={19}/></span><div><b className="text-xl">{count}</b><small className="block text-gray-400">{label}</small></div></div>)}</div>
      {user.perfil==="Aluno"&&<div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800"><AlertTriangle size={17} className="shrink-0"/>O acesso a outras mesas depende de liberação do Gestor ou Administrador.</div>}</>}
  </>;
}
