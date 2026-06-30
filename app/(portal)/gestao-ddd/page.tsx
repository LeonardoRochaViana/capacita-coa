"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AccessRestricted, useAccess } from "@/components/access/AccessProvider";
import { mockMesas } from "@/data/mockMesas";
import type { ManagedDDD } from "@/types";
import { FilePlus2, Pencil, Send, Ban, CheckCircle2 } from "lucide-react";

const initialDDD: ManagedDDD = {
  id:"",tema:"",mesa:"Todas as mesas",objetivo:"",conteudo:"",situacao:"",pergunta:"",
  alternativas:["","","",""],correta:0,data:"2026-06-28",responsavel:"Leonardo Viana",
  unidade:"Todas",turno:"Todos",status:"Rascunho",
};

export default function GestaoDDD(){
  const {user}=useAccess();
  const [form,setForm]=useState<ManagedDDD>(initialDDD);
  const [records,setRecords]=useState<ManagedDDD[]>([]);
  const [notice,setNotice]=useState("");
  useEffect(()=>{const saved=localStorage.getItem("capacita-managed-ddds");if(saved)setRecords(JSON.parse(saved));},[]);
  if(user.perfil==="Aluno")return <AccessRestricted area="Gestão de DDD"/>;
  function save(status:ManagedDDD["status"]){
    const record={...form,id:form.id||`ddd-${Date.now()}`,status,responsavel:form.responsavel||user.nome};
    const next=[record,...records.filter(item=>item.id!==record.id)];
    setRecords(next);setForm(record);
    // Persistência temporária local. No ambiente final, substituir por SharePoint Lists.
    localStorage.setItem("capacita-managed-ddds",JSON.stringify(next));
    setNotice(status==="Publicado"?"DDD publicado e disponível conforme os filtros definidos.":"DDD salvo como rascunho.");
  }
  function edit(record:ManagedDDD){setForm(record);window.scrollTo({top:0,behavior:"smooth"});}
  function inactivate(record:ManagedDDD){const next=records.map(item=>item.id===record.id?{...item,status:"Inativo" as const}:item);setRecords(next);localStorage.setItem("capacita-managed-ddds",JSON.stringify(next));}
  function update(key:keyof ManagedDDD,value:string|number|string[]){setForm(current=>({...current,[key]:value}));}
  return <><PageHeader eyebrow="Gestor e Administrador" title="Gestão de DDD" description="Crie, direcione e publique diálogos diários para as mesas, unidades e turnos do COA." action={<button onClick={()=>{setForm({...initialDDD,responsavel:user.nome});setNotice("");}} className="btn-primary"><FilePlus2 size={16}/>Novo DDD</button>}/>
    {notice&&<div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800"><CheckCircle2 size={17}/>{notice}</div>}
    <section className="card p-5 sm:p-6"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <label className="text-xs font-bold">Data<input type="date" value={form.data} onChange={e=>update("data",e.target.value)} className="field mt-2"/></label>
      <label className="text-xs font-bold">Mesa<select value={form.mesa} onChange={e=>update("mesa",e.target.value)} className="field mt-2"><option>Todas as mesas</option>{mockMesas.map(m=><option key={m.id}>{m.nome}</option>)}</select></label>
      <label className="text-xs font-bold">Unidade<select value={form.unidade} onChange={e=>update("unidade",e.target.value)} className="field mt-2"><option>Todas</option><option>Clementina</option><option>Queiroz</option></select></label>
      <label className="text-xs font-bold">Turno<select value={form.turno} onChange={e=>update("turno",e.target.value)} className="field mt-2"><option>Todos</option><option>A</option><option>B</option><option>C</option></select></label>
    </div><div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="text-xs font-bold">Tema<input value={form.tema} onChange={e=>update("tema",e.target.value)} className="field mt-2" placeholder="Tema do DDD"/></label>
      <label className="text-xs font-bold">Responsável<input value={form.responsavel} onChange={e=>update("responsavel",e.target.value)} className="field mt-2"/></label>
      <label className="text-xs font-bold md:col-span-2">Objetivo<textarea value={form.objetivo} onChange={e=>update("objetivo",e.target.value)} className="field mt-2 min-h-20"/></label>
      <label className="text-xs font-bold">Conteúdo<textarea value={form.conteudo} onChange={e=>update("conteudo",e.target.value)} className="field mt-2 min-h-24"/></label>
      <label className="text-xs font-bold">Situação prática<textarea value={form.situacao} onChange={e=>update("situacao",e.target.value)} className="field mt-2 min-h-24"/></label>
      <label className="text-xs font-bold md:col-span-2">Pergunta rápida<input value={form.pergunta} onChange={e=>update("pergunta",e.target.value)} className="field mt-2"/></label>
      {form.alternativas.map((alternative,index)=><label key={index} className="text-xs font-bold">Alternativa {String.fromCharCode(65+index)}<input value={alternative} onChange={e=>update("alternativas",form.alternativas.map((v,i)=>i===index?e.target.value:v))} className="field mt-2"/></label>)}
      <label className="text-xs font-bold">Resposta correta<select value={form.correta} onChange={e=>update("correta",Number(e.target.value))} className="field mt-2">{["A","B","C","D"].map((x,i)=><option value={i} key={x}>{x}</option>)}</select></label>
      <label className="text-xs font-bold">Status<select value={form.status} onChange={e=>update("status",e.target.value)} className="field mt-2"><option>Rascunho</option><option>Publicado</option><option>Inativo</option></select></label>
    </div><div className="mt-5 flex flex-wrap gap-3"><button onClick={()=>save("Rascunho")} className="btn-secondary">Salvar rascunho</button><button disabled={!form.tema||!form.pergunta||form.alternativas.some(x=>!x)} onClick={()=>save("Publicado")} className="btn-primary"><Send size={15}/>Publicar DDD</button></div></section>
    <section className="card mt-5 overflow-hidden"><div className="p-5"><h2 className="font-bold">DDDs cadastrados</h2><p className="mt-1 text-xs text-gray-400">{records.length} registros na estrutura inicial</p></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="bg-mist text-[10px] uppercase text-gray-400"><tr>{["Tema","Data","Mesa","Unidade","Turno","Status","Ações"].map(x=><th className="px-5 py-3" key={x}>{x}</th>)}</tr></thead><tbody>{records.map(record=><tr key={record.id} className="border-t border-line"><td className="px-5 py-4 font-bold">{record.tema}</td><td className="px-5 py-4">{record.data}</td><td className="px-5 py-4">{record.mesa}</td><td className="px-5 py-4">{record.unidade}</td><td className="px-5 py-4">{record.turno}</td><td className="px-5 py-4"><span className={`rounded-full px-2 py-1 font-bold ${record.status==="Publicado"?"bg-emerald-50 text-emerald-700":record.status==="Inativo"?"bg-red-50 text-red-700":"bg-amber-50 text-amber-700"}`}>{record.status}</span></td><td className="px-5 py-4"><div className="flex gap-2"><button onClick={()=>edit(record)} className="btn-secondary py-2"><Pencil size={14}/>Editar</button><button onClick={()=>inactivate(record)} className="rounded-xl border border-red-200 px-3 py-2 font-bold text-red-700"><Ban size={14}/></button></div></td></tr>)}</tbody></table></div></section>
  </>;
}
