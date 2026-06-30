"use client";
import MinhaMesaAuthorized from "@/components/mesa/MinhaMesaAuthorized";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { mockMesas } from "@/data/mockMesas";
import { mockAulas } from "@/data/mockAulas";
import { mockIts } from "@/data/mockIts";
import { mockFluxogramas } from "@/data/mockFluxogramas";
import { mockDdds } from "@/data/mockDdds";
import { mockTrilhas } from "@/data/mockTrilhas";
import { BookOpen, FileText, Workflow, MessageSquareText, CheckCircle2, AlertCircle, ChevronRight, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

function MinhaMesaLegacy() {
  const [id,setId]=useState("apoio"); const mesa=mockMesas.find(m=>m.id===id)!;
  const aulas=useMemo(()=>mockAulas.filter(a=>a.mesa===mesa.nome),[mesa]); const its=mockIts.filter(x=>x.mesa===mesa.nome); const fluxos=mockFluxogramas.filter(x=>x.mesa===mesa.nome); const ddd=mockDdds.find(x=>x.mesa===mesa.nome); const trilha=mockTrilhas.find(x=>x.mesa===mesa.nome);
  const resumo: Array<[React.ElementType,string,number]> = [[FileText,"ITs e procedimentos",its.length],[Workflow,"Fluxogramas",fluxos.length],[MessageSquareText,"DDD relacionado",ddd?1:0],[TrendingUp,"Indicadores da mesa",6]];
  return <><PageHeader eyebrow="Área operacional" title="Minha Mesa" description="Conteúdos, responsabilidades e evolução organizados pelo contexto de cada operação."/>
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">{mockMesas.map(m=><button key={m.id} onClick={()=>setId(m.id)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${id===m.id?"border-forest bg-forest text-white":"border-line bg-white text-gray-500 hover:border-leaf"}`}>{m.short}</button>)}</div>
    <section className="card overflow-hidden"><div className="h-1.5" style={{backgroundColor:mesa.cor}}/><div className="grid gap-8 p-6 lg:grid-cols-[1.25fr_.75fr] lg:p-8"><div><p className="eyebrow">Mesa selecionada</p><h2 className="mt-2 text-2xl font-bold">{mesa.nome}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">{mesa.descricao}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{mesa.responsabilidades.map(x=><div key={x} className="flex gap-2 text-sm"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-leaf"/><span>{x}</span></div>)}</div></div><div className="rounded-2xl bg-mist p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold">Progresso da trilha</span><b className="text-xl text-leaf">{trilha?.progresso || 24}%</b></div><div className="mt-3 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-leaf" style={{width:`${trilha?.progresso || 24}%`}}/></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white p-3"><b className="text-lg">{aulas.filter(x=>x.status==="Concluído").length}</b><small className="block text-gray-400">aulas concluídas</small></div><div className="rounded-xl bg-white p-3"><b className="text-lg">86%</b><small className="block text-gray-400">média simulados</small></div></div><div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800"><AlertCircle size={16} className="shrink-0"/> 2 atividades exigem atenção nesta semana.</div></div></div></section>
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <section className="card p-5"><div className="mb-4 flex items-center justify-between"><h3 className="flex items-center gap-2 font-bold"><BookOpen size={18} className="text-leaf"/>Aulas operacionais</h3><Link href="/aulas" className="text-xs font-bold text-leaf">Ver todas</Link></div><div className="space-y-2">{aulas.slice(0,4).map(a=><Link key={a.id} href={`/aulas/${a.id}`} className="flex items-center gap-3 rounded-xl border border-line p-3 hover:border-leaf/50"><span className="grid h-8 w-8 place-items-center rounded-lg bg-mist text-leaf"><BookOpen size={15}/></span><span className="min-w-0 flex-1"><b className="block truncate text-xs">{a.titulo}</b><small className="text-gray-400">{a.tempo} min · {a.nivel}</small></span><ChevronRight size={15} className="text-gray-300"/></Link>)}</div></section>
      <section className="card p-5"><h3 className="mb-4 flex items-center gap-2 font-bold"><Target size={18} className="text-leaf"/>Trilha de capacitação</h3><div className="space-y-3">{(trilha?.etapas||["Fundamentos","Procedimento principal","Simulado final"]).map((x,i)=><div key={x} className="flex items-center gap-3"><span className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold ${i<2?"bg-emerald-100 text-emerald-700":"bg-mist text-gray-400"}`}>{i<2?<CheckCircle2 size={14}/>:i+1}</span><span className={`text-xs ${i<2?"text-gray-400 line-through":"font-semibold"}`}>{x}</span></div>)}</div></section>
    </div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{resumo.map(([Icon,label,count])=><div key={label} className="card flex items-center gap-4 p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-700"><Icon size={19}/></span><div><b className="text-xl">{count}</b><small className="block text-gray-400">{label}</small></div></div>)}</div>
  </>;
}

export default MinhaMesaAuthorized;
