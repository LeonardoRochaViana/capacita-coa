"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cx, initials } from "@/lib/utils";
import { LayoutDashboard, PanelsTopLeft, MessageSquareText, GraduationCap, Library, Workflow, ListChecks, BrainCircuit, History, Award, ChartNoAxesCombined, Settings, Bell, Search, Menu, X, LogOut, FilePlus2, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClealcoLogo } from "@/components/brand/ClealcoLogo";
import { AccessRestricted, useAccess } from "@/components/access/AccessProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import type { AccessRole } from "@/types";

const nav = [
  {href:"/dashboard",label:"Painel",icon:LayoutDashboard},
  {href:"/minha-mesa",label:"Minha Mesa",icon:PanelsTopLeft},
  {href:"/ddd",label:"DDD do Dia",icon:MessageSquareText},
  {href:"/gestao-ddd",label:"Gestão de DDD",icon:FilePlus2,roles:["Gestor","Administrador"] as AccessRole[]},
  {href:"/gestao-acessos",label:"Liberação de Mesas",icon:Users,roles:["Gestor","Administrador"] as AccessRole[]},
  {href:"/aulas",label:"Aulas Operacionais",icon:GraduationCap},
  {href:"/its",label:"ITs e Procedimentos",icon:Library},
  {href:"/fluxogramas",label:"Fluxogramas",icon:Workflow},
  {href:"/checklists",label:"Checklists",icon:ListChecks},
  {href:"/simulados",label:"Simulados",icon:BrainCircuit},
  {href:"/historico",label:"Histórico",icon:History},
  {href:"/certificados",label:"Certificados",icon:Award},
  {href:"/gestor",label:"Painel do Gestor",icon:ChartNoAxesCombined,roles:["Gestor","Administrador"] as AccessRole[]},
  {href:"/admin",label:"Administração",icon:Settings,roles:["Administrador"] as AccessRole[]},
  {href:"/admin/simulados",label:"Gestão de Simulados e Testes",icon:BrainCircuit,roles:["Administrador"] as AccessRole[]},
  {href:"/admin/its",label:"Gestão de ITs e Procedimentos",icon:Library,roles:["Administrador"] as AccessRole[]},
  {href:"/admin/fluxogramas",label:"Gestão de Fluxogramas",icon:Workflow,roles:["Administrador"] as AccessRole[]},
  {href:"/admin/aulas",label:"Gestão de Aulas",icon:GraduationCap,roles:["Administrador"] as AccessRole[]},
  {href:"/admin/checklists",label:"Gestão de Checklists",icon:ListChecks,roles:["Administrador"] as AccessRole[]},
  {href:"/admin/usuarios",label:"Gestão de Usuários",icon:Users,roles:["Administrador"] as AccessRole[]},
];

export function AppShell({ children }: { children:React.ReactNode }) {
  const pathname=usePathname(); const router=useRouter(); const [open,setOpen]=useState(false); const [collapsed,setCollapsed]=useState(false); const asideRef=useRef<HTMLElement>(null); const {user}=useAccess();
  const visibleNav=nav.filter(item=>!item.roles||item.roles.includes(user.perfil));
  const isActive=(href:string)=>href==="/admin"?pathname===href:pathname.startsWith(href);
  const matchedNav=[...nav].sort((a,b)=>b.href.length-a.href.length).find(item=>pathname===item.href||pathname.startsWith(`${item.href}/`));
  const denied=Boolean(matchedNav?.roles&&!matchedNav.roles.includes(user.perfil));
  useEffect(()=>{setCollapsed(localStorage.getItem("capacita-sidebar-collapsed")==="true");},[]);
  useEffect(()=>{function handleOutside(event:MouseEvent){if(window.innerWidth<1024||collapsed||asideRef.current?.contains(event.target as Node))return;setCollapsed(true);localStorage.setItem("capacita-sidebar-collapsed","true");}document.addEventListener("mousedown",handleOutside);return()=>document.removeEventListener("mousedown",handleOutside);},[collapsed]);
  function toggleCollapsed(){setCollapsed(current=>{const next=!current;localStorage.setItem("capacita-sidebar-collapsed",String(next));return next;});}
  return <div className="min-h-screen">
    {open && <button aria-label="Fechar menu" onClick={()=>setOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden"/>}
    <aside ref={asideRef} className={cx("fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-forest text-white transition-[width,transform] duration-300 lg:translate-x-0",collapsed?"lg:w-[72px]":"lg:w-[260px]",open?"translate-x-0":"-translate-x-full")}>
      <button aria-label={collapsed?"Expandir menu lateral":"Recolher menu lateral"} title={collapsed?"Expandir menu lateral":"Recolher menu lateral"} onClick={toggleCollapsed} className="absolute -right-3 top-28 z-[60] hidden h-7 w-7 place-items-center rounded-full border border-white/20 bg-forest text-white shadow-lg transition hover:bg-leaf lg:grid">{collapsed?<ChevronRight size={15}/>:<ChevronLeft size={15}/>}</button>
      <div className={cx("flex min-h-24 items-center justify-between border-b border-white/10 px-5 py-3",collapsed&&"lg:justify-center lg:px-2")}>
        <Link href="/dashboard" title={collapsed?"Projeto Capacita COA":undefined} className={cx("flex min-w-0 items-center gap-3",collapsed&&"lg:justify-center")}><span className={cx("logo-surface shrink-0 rounded-sm px-2 py-1.5",collapsed&&"lg:px-1.5")}><ClealcoLogo priority className={cx("w-[72px]",collapsed&&"lg:w-[38px]")}/></span><span className={cx("min-w-0",collapsed&&"lg:hidden")}><b className="block text-sm leading-4">Projeto<br/>Capacita COA</b><small className="mt-1 block text-[9px] text-white/55">Desenvolvimento operacional</small></span></Link>
        <button onClick={()=>setOpen(false)} className="lg:hidden"><X size={20}/></button>
      </div>
      <nav className={cx("flex-1 overflow-y-auto px-3 py-5",collapsed&&"lg:px-2")}><p className={cx("mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/35",collapsed&&"lg:hidden")}>Navegação</p>{visibleNav.map(({href,label,icon:Icon})=><Link title={collapsed?label:undefined} aria-label={collapsed?label:undefined} onClick={()=>setOpen(false)} key={href} href={href} className={cx("mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",collapsed&&"lg:justify-center lg:px-0",isActive(href)?"bg-leaf text-white shadow-sm":"text-white/70 hover:bg-white/10 hover:text-white")}><Icon size={18}/><span className={cx(collapsed&&"lg:hidden")}>{label}</span>{href==="/ddd"&&<span className={cx("ml-auto h-2 w-2 rounded-full bg-white",collapsed&&"lg:hidden")}/>}</Link>)}</nav>
      <div className={cx("border-t border-white/10 p-4",collapsed&&"lg:px-2")}><div className={cx("flex items-center gap-3",collapsed&&"lg:flex-col lg:gap-2")}><span title={collapsed?user.nome:undefined} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold">{initials(user.nome)}</span><span className={cx("min-w-0 flex-1",collapsed&&"lg:hidden")}><b className="block truncate text-xs">{user.nome}</b><small className="text-[10px] text-white/50">{user.perfil} · {user.mesa}</small></span><button title="Sair" aria-label="Sair" onClick={async()=>{await fetch("/api/auth/logout",{method:"POST"});router.replace("/login");}}><LogOut size={17} className="text-white/50"/></button></div></div>
    </aside>
    <div className={cx("transition-[padding] duration-300",collapsed?"lg:pl-[72px]":"lg:pl-[260px]")}>
      <header className="sticky top-0 z-30 flex h-20 items-center gap-3 border-b border-line bg-white/95 px-4 backdrop-blur dark:border-[#34343a] dark:bg-[#202024]/95 sm:px-7">
        <button onClick={()=>setOpen(true)} className="rounded-lg p-2 hover:bg-mist dark:hover:bg-[#2a2a2f] lg:hidden"><Menu size={21}/></button>
        <div className="relative hidden max-w-md flex-1 md:block"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input className="field py-2.5 pl-10" placeholder="Buscar aulas, ITs e procedimentos..."/></div>
        <div className="ml-auto flex items-center gap-2"><ThemeToggle/><button className="relative rounded-xl border border-line p-2.5 text-ink hover:bg-mist dark:border-[#34343a] dark:text-gray-200 dark:hover:bg-[#2a2a2f]"><Bell size={18}/><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-leaf ring-2 ring-white dark:ring-[#202024]"/></button></div>
      </header>
      <main className="page-enter mx-auto max-w-[1500px] p-4 pb-24 sm:p-7 lg:pb-8">{denied?<AccessRestricted area="Área de gestão"/>:children}</main>
    </div>
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-line bg-white px-2 py-2 dark:border-[#34343a] dark:bg-[#202024] lg:hidden">{visibleNav.filter(item=>["/dashboard","/minha-mesa","/ddd","/aulas","/simulados"].includes(item.href)).map(({href,label,icon:Icon})=><Link key={href} href={href} className={cx("flex min-w-[58px] flex-col items-center gap-1 rounded-lg p-1.5 text-[9px] font-semibold",pathname.startsWith(href)?"text-leaf":"text-gray-400")}><Icon size={19}/>{label}</Link>)}</nav>
  </div>;
}
