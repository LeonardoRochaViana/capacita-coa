"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AccessRestricted, useAccess } from "@/components/access/AccessProvider";
import type { EmployeeProfile, Mesa, MesaPermissionStatus, UserTablePermission } from "@/types";
import { Check, Link2, LockKeyhole, Save, ShieldCheck } from "lucide-react";

type ResponseData={permissions:UserTablePermission[];mesas:Mesa[];users:EmployeeProfile[];role:string};

export default function GestaoAcessos(){
  const {user}=useAccess();
  const [data,setData]=useState<ResponseData>({permissions:[],mesas:[],users:[],role:""});
  const [employeeId,setEmployeeId]=useState("");
  const [draft,setDraft]=useState<Record<string,MesaPermissionStatus>>({});
  const [operational,setOperational]=useState({turno:"",mesa:"",unidade:"",observacao:"",data_prevista_inicio:""});
  const [notice,setNotice]=useState("");
  useEffect(()=>{fetch("/api/mesa-permissions").then(response=>response.json()).then((value:Partial<ResponseData>)=>{const safeData:ResponseData={permissions:Array.isArray(value.permissions)?value.permissions:[],mesas:Array.isArray(value.mesas)?value.mesas:[],users:Array.isArray(value.users)?value.users:[],role:String(value.role??"")};setData(safeData);if(safeData.users[0])setEmployeeId(safeData.users[0].id);});},[user]);
  useEffect(()=>{const next:Record<string,MesaPermissionStatus>={};for(const mesa of data.mesas){next[mesa.id]=data.permissions.find(item=>item.user_id===employeeId&&item.mesa_id===mesa.id)?.status||"bloqueado";}setDraft(next);},[employeeId,data]);
  const employee=useMemo(()=>data.users.find(item=>item.id===employeeId),[data.users,employeeId]);
  useEffect(()=>{if(employee)setOperational({turno:employee.turno||"",mesa:employee.mesa||"",unidade:employee.unidade||"",observacao:employee.observacao||"",data_prevista_inicio:employee.data_prevista_inicio||""});},[employee]);
  if(user.perfil==="Aluno")return <AccessRestricted area="Liberação de mesas"/>;
  async function save(){
    const requests=Object.entries(draft).map(([mesaId,status])=>fetch("/api/mesa-permissions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:employeeId,mesaId,status,observacao:"Permissão definida pela liderança no portal."})}));
    const responses=await Promise.all(requests);
    if(responses.every(response=>response.ok)){setNotice("Permissões salvas. O funcionário verá somente as mesas liberadas.");const refreshed=await fetch("/api/mesa-permissions");setData(await refreshed.json());}
    else setNotice("Não foi possível salvar uma ou mais permissões.");
  }
  async function saveOperational(release=false){
    if(!employeeId)return;
    const patch={...operational,...(release?{status:"aguardando_primeiro_acesso" as const}:{})};
    const response=await fetch("/api/users",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:employeeId,patch})});
    const data=await response.json();
    if(!response.ok){setNotice(data.error||"Não foi possível salvar os dados operacionais.");return;}
    if(release){
      const inviteResponse=await fetch("/api/users/invite",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:employeeId})});
      const invite=await inviteResponse.json();
      setNotice(inviteResponse.ok?`Primeiro acesso liberado: ${window.location.origin}${invite.invitePath}`:invite.error);
    }else setNotice("Dados operacionais salvos.");
    const refreshed=await fetch("/api/mesa-permissions");setData(await refreshed.json());
  }
  return <><PageHeader eyebrow="Gestor e Administrador" title="Liberação de mesas" description="Defina individualmente quais operações cada funcionário está autorizado a estudar." action={<button onClick={save} disabled={!employeeId} className="btn-primary"><Save size={16}/>Salvar permissões</button>}/>
    {notice&&<div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800"><ShieldCheck size={17}/>{notice}</div>}
    <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
      <aside className="card h-fit p-5"><p className="eyebrow">Funcionário</p><label className="mt-4 block text-xs font-bold">Selecionar funcionário<select value={employeeId} onChange={event=>setEmployeeId(event.target.value)} className="field mt-2">{data.users.map(item=><option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>{employee&&<><div className="mt-5 rounded-xl bg-mist p-4 text-xs leading-6"><b className="block text-sm">{employee.nome}</b><span>{employee.funcao} · {employee.unidade}</span><br/><span>Status: {String(employee.status??"").replaceAll("_"," ")}</span></div><div className="mt-5 space-y-3"><h3 className="text-xs font-bold">Configuração operacional</h3><label className="block text-xs font-bold">Turno<input className="field mt-1" value={operational.turno} onChange={e=>setOperational(current=>({...current,turno:e.target.value}))}/></label><label className="block text-xs font-bold">Mesa principal<input className="field mt-1" value={operational.mesa} onChange={e=>setOperational(current=>({...current,mesa:e.target.value}))}/></label><label className="block text-xs font-bold">Unidade<input className="field mt-1" value={operational.unidade} onChange={e=>setOperational(current=>({...current,unidade:e.target.value}))}/></label><label className="block text-xs font-bold">Início previsto<input type="date" className="field mt-1" value={operational.data_prevista_inicio} onChange={e=>setOperational(current=>({...current,data_prevista_inicio:e.target.value}))}/></label><label className="block text-xs font-bold">Observação<textarea className="field mt-1 min-h-20" value={operational.observacao} onChange={e=>setOperational(current=>({...current,observacao:e.target.value}))}/></label><button onClick={()=>saveOperational(false)} className="btn-secondary w-full justify-center"><Save size={15}/>Salvar configuração</button><button onClick={()=>saveOperational(true)} className="btn-primary w-full justify-center"><Link2 size={15}/>Liberar primeiro acesso</button></div></>}<div className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800"><LockKeyhole size={17} className="mt-0.5 shrink-0"/>Mesas bloqueadas não aparecem para o funcionário e são negadas também pela API.</div></aside>
      <section className="card overflow-hidden"><div className="border-b border-line p-5"><h2 className="font-bold">Mesas disponíveis para liberação</h2><p className="mt-1 text-xs text-gray-400">Marque uma ou mais operações conforme o plano de desenvolvimento definido pela liderança.</p></div><div className="grid gap-3 p-5 md:grid-cols-2">{data.mesas.map(mesa=>{const status=draft[mesa.id]||"bloqueado";const enabled=status==="liberado"||status==="concluido";return <button key={mesa.id} onClick={()=>setDraft(current=>({...current,[mesa.id]:enabled?"bloqueado":"liberado"}))} className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${enabled?"border-red-200 bg-red-50":"border-line bg-white hover:border-gray-300"}`}><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border ${enabled?"border-leaf bg-leaf text-white":"border-gray-300"}`}>{enabled&&<Check size={15}/>}</span><span className="flex-1"><b className="block text-sm">{mesa.nome}</b><small className="mt-1 block leading-5 text-gray-500">{mesa.descricao}</small><span className={`mt-3 inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${enabled?"bg-white text-leaf":"bg-mist text-gray-500"}`}>{status}</span></span></button>})}</div></section>
    </div>
  </>;
}
