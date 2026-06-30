"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { AccessRestricted, useAccess } from "@/components/access/AccessProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { Plus, Pencil, Ban, Eye, CheckCircle2 } from "lucide-react";

const config:Record<string,{title:string;description:string;items:string[]}> = {
  simulados:{title:"Gestão de Simulados e Testes",description:"Cadastre avaliações, perguntas, alternativas, critérios e prazos.",items:["Simulado Mesa do Apoio","Avaliação GSA","Teste de Passagem de Turno"]},
  its:{title:"Gestão de ITs e Procedimentos",description:"Controle códigos, versões, vínculos, responsáveis e vigência dos documentos oficiais.",items:["IT — Agendamento de Frete","IT — Controle de Comboios","IT — Comunicação Operacional"]},
  fluxogramas:{title:"Gestão de Fluxogramas",description:"Cadastre etapas, entradas, saídas, responsáveis, riscos e indicadores dos processos.",items:["Fluxo de Frete de Prancha","Fluxo de Foco de Incêndio","Fluxo de Abertura de O.S."]},
  aulas:{title:"Gestão de Aulas",description:"Vincule aulas às mesas, ITs, fluxogramas, checklists e avaliações.",items:["Agendamento de Frete de Prancha","Comunicação Operacional","Abertura de O.S."]},
  checklists:{title:"Gestão de Checklists",description:"Crie listas de estudo ou execução e publique-as para as mesas responsáveis.",items:["Checklist de Frete","Checklist de Passagem de Turno","Checklist de Abertura de O.S."]},
  usuarios:{title:"Gestão de Usuários",description:"Cadastre usuários e defina perfis de acesso, mesas, unidades e turnos.",items:["João Silva · Aluno","Leonardo Viana · Gestor","Administrador COA · Administrador"]},
};

export default function AdminModule(){
  const {user}=useAccess();const {module}=useParams<{module:string}>();const page=config[module]||config.simulados;const [notice,setNotice]=useState("");
  if(user.perfil!=="Administrador")return <AccessRestricted area={page.title}/>;
  function notify(action:string,item=page.title){setNotice(`${action}: ${item}`);setTimeout(()=>setNotice(""),2500);}
  return <><PageHeader eyebrow="Administração de conteúdos" title={page.title} description={page.description} action={<button onClick={()=>notify("Novo cadastro")} className="btn-primary"><Plus size={16}/>Novo cadastro</button>}/>
    {notice&&<div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800"><CheckCircle2 size={17}/>{notice}</div>}
    <div className="card overflow-hidden"><div className="grid grid-cols-[1fr_auto] border-b border-line bg-mist px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400"><span>Conteúdo cadastrado</span><span>Ações administrativas</span></div>{page.items.map(item=><div key={item} className="flex flex-col gap-3 border-b border-line p-5 last:border-0 sm:flex-row sm:items-center"><div className="flex-1"><b className="text-sm">{item}</b><p className="mt-1 text-xs text-gray-400">Publicado · atualização controlada · vínculo operacional ativo</p></div><div className="flex gap-2"><button onClick={()=>notify("Visualizar",item)} className="btn-secondary py-2"><Eye size={14}/>Visualizar</button><button onClick={()=>notify("Editar",item)} className="rounded-xl bg-forest px-3 py-2 text-xs font-bold text-white"><Pencil size={14}/></button><button onClick={()=>notify("Inativar",item)} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-700"><Ban size={14}/></button></div></div>)}</div>
  </>;
}
