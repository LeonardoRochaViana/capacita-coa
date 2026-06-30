"use client";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/cards/MetricCard";
import { BookOpenCheck, Clock3, MessageSquareText, BrainCircuit, Award, TriangleAlert, ArrowRight, Flame, CalendarDays, CheckCircle2, Route, Sparkles } from "lucide-react";
import { useAccess } from "@/components/access/AccessProvider";
import { useEffect, useState } from "react";
import type { ManagedDDD, Mesa, UserTablePermission } from "@/types";

export default function Dashboard() {
  const {user}=useAccess();const [published,setPublished]=useState<ManagedDDD|null>(null);const [authorizedMesas,setAuthorizedMesas]=useState<Mesa[]>([]);
  useEffect(()=>{const saved=localStorage.getItem("capacita-managed-ddds");if(!saved)return;const match=(JSON.parse(saved) as ManagedDDD[]).find(item=>item.status==="Publicado"&&(item.mesa==="Todas as mesas"||item.mesa===user.mesa)&&(item.unidade==="Todas"||item.unidade===user.unidade)&&(item.turno==="Todos"||item.turno===user.turno));setPublished(match||null);},[user]);
  useEffect(()=>{fetch("/api/mesa-permissions").then(response=>response.json()).then((data:{mesas:Mesa[];permissions:UserTablePermission[]})=>{setAuthorizedMesas(user.perfil==="Aluno"?data.mesas.filter(mesa=>data.permissions.some(permission=>permission.user_id===user.id&&permission.mesa_id===mesa.id&&(permission.status==="liberado"||permission.status==="concluido"))):data.mesas);});},[user]);
  const description=user.perfil==="Aluno"?"Acompanhe seus treinamentos autorizados, atividades pendentes e evolução individual.":user.perfil==="Gestor"?"Acompanhe sua equipe, as permissões de treinamento e as pendências operacionais.":"Visualize todas as mesas, usuários, treinamentos e cadastros oficiais.";
  return <><PageHeader eyebrow="Visão geral da capacitação" title={`Olá, ${user.nome.split(" ")[0]} 👋`} description={description}/>
    {user.perfil==="Aluno"&&authorizedMesas.length===0&&<div className="card mb-5 border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-900">Nenhuma mesa de treinamento foi liberada para você no momento. Procure seu gestor para mais informações.</div>}
    {user.perfil==="Aluno"&&authorizedMesas.length>0&&<div className="card mb-5 p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Treinamentos liberados</p><h2 className="mt-1 font-bold">Mesas autorizadas pela liderança</h2></div><b className="text-2xl text-leaf">{authorizedMesas.length}</b></div><div className="mt-4 flex flex-wrap gap-2">{authorizedMesas.map(mesa=><Link href={`/minha-mesa?mesa=${mesa.id}`} key={mesa.id} className="rounded-full border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-leaf">{mesa.short}</Link>)}</div></div>}
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      <MetricCard label="Aulas concluídas" value="8" detail="+2 neste mês" icon={BookOpenCheck}/>
      <MetricCard label="Aulas pendentes" value="2" detail="1 obrigatória" icon={Clock3} tone="amber"/>
      <MetricCard label="DDDs realizados" value="18" detail="94% de presença" icon={MessageSquareText} tone="neutral"/>
      <MetricCard label="Simulados realizados" value="5" detail="Média de 86%" icon={BrainCircuit}/>
      <MetricCard label="Certificados emitidos" value="4" detail="1 em progresso" icon={Award} tone="neutral"/>
      <MetricCard label="Próximos do vencimento" value="1" detail="Requer atenção" icon={TriangleAlert} tone="red"/>
    </div>
    <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_.9fr]">
      <section className="card overflow-hidden">
        <div className="bg-forest p-6 text-white sm:p-7"><div className="flex items-center justify-between"><span className="rounded-full bg-blush px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-forest">DDD de hoje · 5 min</span><MessageSquareText className="text-blush"/></div><h2 className="mt-8 text-2xl font-bold">{published?.tema||"Priorizar Comboio"}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/65">{published?.objetivo||"Como decidir com agilidade quando duas frentes precisam de abastecimento ao mesmo tempo."}</p><div className="mt-6 flex items-center gap-4 text-xs text-white/50"><span>{published?.mesa||"Mesa do Apoio"}</span><span>•</span><span>Ainda não confirmado</span></div></div>
        <div className="flex items-center justify-between p-5"><div className="flex items-center gap-3 text-sm"><span className="grid h-9 w-9 place-items-center rounded-full bg-amber-50 text-amber-700"><Flame size={17}/></span><span><b className="block text-xs">Sequência de 6 dias</b><small className="text-gray-400">Continue assim!</small></span></div><Link href="/ddd" className="btn-primary">Iniciar DDD <ArrowRight size={16}/></Link></div>
      </section>
      <section className="card p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Sua evolução</p><h2 className="mt-1 font-bold">Trilha Mesa do Apoio</h2></div><span className="text-2xl font-bold text-leaf">38%</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-mist"><div className="h-full w-[38%] rounded-full bg-leaf"/></div><div className="mt-5 space-y-3">{["Prancha","Munck","Comboio","Emergências"].map((x,i)=><div key={x} className="flex items-center gap-3 text-sm"><span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${i===0?"bg-emerald-100 text-emerald-700":i===1?"bg-amber-100 text-amber-700":"bg-mist text-gray-400"}`}>{i===0?<CheckCircle2 size={14}/>:i+1}</span><span className={i===0?"line-through text-gray-400":"font-medium"}>{x}</span>{i===1&&<span className="ml-auto text-[10px] font-bold text-amber-700">EM CURSO</span>}</div>)}</div><Link href="/minha-mesa" className="mt-5 flex items-center gap-1 text-xs font-bold text-leaf">Ver trilha completa <ArrowRight size={13}/></Link></section>
    </div>
    <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[
        [CalendarDays,"Próxima aula obrigatória","Agendamento de Frete de Prancha","Hoje · 15 min","/aulas/0-0"],
        [BrainCircuit,"Simulado pendente","Fundamentos da Mesa do Apoio","Prazo: 28/06","/simulados"],
        [Route,"Pendência da mesa","Reciclagem: Fluxo de Incêndio","Vence em 4 dias","/fluxogramas"]
      ].map(([Icon,label,title,meta,href],i)=><Link href={href as string} key={title as string} className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-leaf/40"><span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${i===0?"bg-slate-100 text-slate-700":i===1?"bg-amber-50 text-amber-700":"bg-red-50 text-red-700"}`}><Icon size={20}/></span><span className="min-w-0 flex-1"><small className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label as string}</small><b className="mt-1 block truncate text-sm">{title as string}</b><small className="text-gray-400">{meta as string}</small></span><ArrowRight size={17} className="text-gray-300 group-hover:text-leaf"/></Link>)}
    </div>
    <div className="mt-5 rounded-2xl border border-blush/40 bg-blush/10 p-5"><div className="flex gap-4"><Sparkles className="shrink-0 text-leaf"/><div><b className="text-sm">Ritmo recomendado para esta semana</b><p className="mt-1 text-xs leading-5 text-gray-600">1 DDD por turno · 2 pílulas de conhecimento · 1 aula operacional curta · próximo simulado em 12 dias.</p></div></div></div>
  </>;
}
