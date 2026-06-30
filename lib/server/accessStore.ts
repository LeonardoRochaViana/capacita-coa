import "server-only";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { accessProfiles } from "@/data/accessProfiles";
import { mockMesas } from "@/data/mockMesas";
import type { AccessUser, AccountStatus, EmployeeProfile, MesaPermissionStatus, UserTablePermission } from "@/types";

// ATENÇÃO: todos os usuários, hashes, permissões, sessões, convites e resets abaixo vivem
// somente na memória deste processo. Todo estado criado em execução é perdido a cada restart.
// Substituir por persistência real (Supabase/SharePoint/banco com políticas de acesso) antes
// de qualquer uso em produção.
const trainingMesaIds = ["gsa","performance","log-clementina","log-queiroz","man-clementina","man-queiroz","apoio"];

const initialPermissions: UserTablePermission[] = [
  {
    id:"permission-aluno-gsa",
    user_id:"aluno",
    mesa_id:"gsa",
    liberado_por:"gestor",
    data_liberacao:"2026-06-28T08:00:00.000Z",
    status:"liberado",
    observacao:"Trilha inicial definida pela liderança.",
  },
];

const now="2026-06-28T08:00:00.000Z";
const initialProfiles:EmployeeProfile[]=[
  {...accessProfiles[0],matricula:"COA-1042",cracha:"1042",setor:"COA",funcao:"Operador COA",gestor_id:"gestor",status:"ativo",primeiro_acesso_concluido:true,created_at:now,updated_at:now},
  {...accessProfiles[1],matricula:"COA-0088",cracha:"0088",setor:"COA",funcao:"Gestor COA",status:"ativo",primeiro_acesso_concluido:true,created_at:now,updated_at:now},
  {...accessProfiles[2],matricula:"ADM-0001",cracha:"0001",setor:"Tecnologia",funcao:"Administrador do Portal",status:"ativo",primeiro_acesso_concluido:true,created_at:now,updated_at:now},
];

type TokenRecord={userId:string;expiresAt:number};
type AccessDatabase={
  profiles:EmployeeProfile[];
  permissions:UserTablePermission[];
  credentials:Record<string,string>;
  sessions:Record<string,TokenRecord>;
  invites:Record<string,TokenRecord>;
  resets:Record<string,TokenRecord>;
};

const globalStore=globalThis as typeof globalThis&{__capacitaAccessDb?:AccessDatabase};
function hashPassword(password:string,salt=randomBytes(16).toString("hex")){
  return `${salt}:${scryptSync(password,salt,64).toString("hex")}`;
}
function database(){
  if(!globalStore.__capacitaAccessDb)globalStore.__capacitaAccessDb={
    profiles:initialProfiles,
    permissions:initialPermissions,
    credentials:{aluno:hashPassword("Colaborador@2026"),gestor:hashPassword("Gestor@2026"),admin:hashPassword("Admin@2026")},
    sessions:{},invites:{},resets:{},
  };
  return globalStore.__capacitaAccessDb;
}

export const trainingMesas = mockMesas.filter(mesa=>trainingMesaIds.includes(mesa.id));

export function getAccessUser(id?:string):AccessUser|undefined {
  return database().profiles.find(user=>user.id===id);
}
export function getProfile(id?:string){return database().profiles.find(user=>user.id===id);}
export function listProfiles(requester:AccessUser){
  if(requester.perfil==="Administrador")return database().profiles;
  if(requester.perfil==="Gestor")return database().profiles.filter(profile=>profile.gestor_id===requester.id);
  return database().profiles.filter(profile=>profile.id===requester.id);
}
export function createEmployee(requester:AccessUser,input:Partial<EmployeeProfile>){
  if(requester.perfil!=="Administrador")throw new Error("Somente o Administrador pode criar o perfil base.");
  if(!input.nome||!input.unidade||!input.setor||!input.funcao||!input.gestor_id)throw new Error("Preencha os dados obrigatórios.");
  const timestamp=new Date().toISOString();
  const profile:EmployeeProfile={id:`employee-${Date.now()}`,nome:input.nome,email:input.email||"",unidade:input.unidade,turno:"",mesa:"",perfil:"Aluno",matricula:input.matricula||"",setor:input.setor,funcao:input.funcao,gestor_id:input.gestor_id,status:"aguardando_configuracao",primeiro_acesso_concluido:false,created_at:timestamp,updated_at:timestamp};
  database().profiles.push(profile);return profile;
}
export function updateEmployee(requester:AccessUser,userId:string,patch:Partial<EmployeeProfile>){
  const profile=getProfile(userId);if(!profile||!canManageEmployee(requester,profile))throw new Error("Colaborador fora da sua área de gestão.");
  if(requester.perfil==="Gestor"&&patch.status==="ativo"&&!profile.primeiro_acesso_concluido)throw new Error("O colaborador deve concluir o primeiro acesso antes de ser ativado.");
  const allowed=requester.perfil==="Administrador"?patch:{turno:patch.turno,mesa:patch.mesa,unidade:patch.unidade,observacao:patch.observacao,data_prevista_inicio:patch.data_prevista_inicio,status:patch.status};
  Object.assign(profile,allowed,{updated_at:new Date().toISOString()});return profile;
}

export function canManageEmployee(manager:AccessUser,employee:AccessUser){
  if(manager.perfil==="Administrador")return true;
  return manager.perfil==="Gestor"&&employee.perfil==="Aluno"&&getProfile(employee.id)?.gestor_id===manager.id;
}

export function canAccessMesa(user:AccessUser,mesaId:string){
  if(user.perfil==="Administrador"||user.perfil==="Gestor")return trainingMesaIds.includes(mesaId);
  const profile=getProfile(user.id);
  if(!profile||profile.status!=="ativo")return false;
  return database().permissions.some(item=>item.user_id===user.id&&item.mesa_id===mesaId&&(item.status==="liberado"||item.status==="concluido"));
}

export function listPermissions(user:AccessUser){
  const permissions=database().permissions;
  if(user.perfil==="Administrador")return permissions;
  if(user.perfil==="Gestor"){
    const teamIds=database().profiles.filter(employee=>canManageEmployee(user,employee)).map(employee=>employee.id);
    return permissions.filter(item=>teamIds.includes(item.user_id));
  }
  return permissions.filter(item=>item.user_id===user.id);
}

export function getAccessibleMesaNames(user:AccessUser):string[]|"all"{
  if(user.perfil!=="Aluno")return "all";
  const released=listPermissions(user)
    .filter(item=>item.user_id===user.id&&(item.status==="liberado"||item.status==="concluido"))
    .map(item=>trainingMesas.find(mesa=>mesa.id===item.mesa_id)?.nome)
    .filter((name):name is string=>Boolean(name));
  return [...new Set([...released,"Geral COA"])];
}

export function filterAccessibleMesaItems<T extends {mesa:string}>(user:AccessUser,items:T[]){
  const accessible=getAccessibleMesaNames(user);
  const all=accessible==="all";
  return {
    items:all?items:items.filter(item=>accessible.includes(item.mesa)),
    mesas:all?[...new Set(items.map(item=>item.mesa))]:accessible,
    all,
  };
}

export function listManageableUsers(user:AccessUser){
  if(user.perfil==="Administrador")return database().profiles.filter(item=>item.perfil==="Aluno");
  if(user.perfil==="Gestor")return database().profiles.filter(item=>canManageEmployee(user,item));
  return [];
}

export function setPermission(input:{manager:AccessUser;userId:string;mesaId:string;status:MesaPermissionStatus;observacao?:string}){
  const employee=getAccessUser(input.userId);
  if(!employee||!canManageEmployee(input.manager,employee))throw new Error("Usuário fora da área de gestão.");
  if(!trainingMesaIds.includes(input.mesaId))throw new Error("Mesa inválida.");
  const current=database().permissions.find(item=>item.user_id===input.userId&&item.mesa_id===input.mesaId);
  const record:UserTablePermission={
    id:current?.id||`permission-${input.userId}-${input.mesaId}`,
    user_id:input.userId,
    mesa_id:input.mesaId,
    liberado_por:input.manager.id,
    data_liberacao:new Date().toISOString(),
    status:input.status,
    observacao:input.observacao||"",
  };
  database().permissions=[record,...database().permissions.filter(item=>item.id!==record.id)];
  return record;
}

export function createSession(userId:string){
  const token=randomUUID();database().sessions[token]={userId,expiresAt:Date.now()+1000*60*60*8};return token;
}
export function getSessionProfile(token?:string){
  if(!token)return undefined;const session=database().sessions[token];
  if(!session||session.expiresAt<Date.now()){if(token)delete database().sessions[token];return undefined;}
  const profile=getProfile(session.userId);
  if(!profile||profile.status==="bloqueado"||profile.status==="inativo"){delete database().sessions[token];return undefined;}
  return profile;
}
export function revokeSession(token?:string){if(token)delete database().sessions[token];}
export function authenticate(identifier:string,password:string){
  const normalized=identifier.trim().toLowerCase();
  const profile=database().profiles.find(item=>item.email.toLowerCase()===normalized||item.cracha===identifier.trim()||item.matricula===identifier.trim());
  if(!profile)return {error:"Usuário não encontrado.",status:401} as const;
  if(profile.status==="aguardando_configuracao")return {error:"Seu cadastro ainda está em configuração. Procure seu gestor.",status:403} as const;
  if(profile.status==="aguardando_primeiro_acesso")return {error:"Finalize seu primeiro acesso antes de entrar no portal.",status:409,firstAccess:true} as const;
  if(profile.status==="bloqueado"||profile.status==="inativo")return {error:"Seu acesso está bloqueado ou inativo. Procure o Administrador.",status:403} as const;
  const stored=database().credentials[profile.id];if(!stored||!verifyPassword(password,stored))return {error:"Credenciais inválidas.",status:401} as const;
  return {profile,token:createSession(profile.id)} as const;
}
function verifyPassword(password:string,stored:string){
  const [salt,key]=stored.split(":");const derived=scryptSync(password,salt,64);const expected=Buffer.from(key,"hex");return expected.length===derived.length&&timingSafeEqual(expected,derived);
}
export function createInvite(requester:AccessUser,userId:string){
  const profile=getProfile(userId);if(!profile||!canManageEmployee(requester,profile))throw new Error("Colaborador fora da sua área de gestão.");
  if(profile.status!=="aguardando_primeiro_acesso")throw new Error("O colaborador ainda não foi liberado para o primeiro acesso.");
  if(!profile.turno||!profile.mesa||!profile.unidade)throw new Error("Complete turno, mesa principal e unidade antes de liberar o primeiro acesso.");
  if(!database().permissions.some(item=>item.user_id===userId&&item.status==="liberado"))throw new Error("Libere ao menos uma mesa de treinamento antes do primeiro acesso.");
  const token=randomBytes(24).toString("hex");database().invites[token]={userId,expiresAt:Date.now()+1000*60*60*24};return token;
}
export function validateInvite(token:string){const record=database().invites[token];if(!record||record.expiresAt<Date.now())return undefined;const profile=getProfile(record.userId);return profile?.status==="aguardando_primeiro_acesso"?profile:undefined;}
export function completeFirstAccess(token:string,cracha:string,password:string){
  const profile=validateInvite(token);if(!profile)throw new Error("Convite inválido ou expirado.");
  if(!cracha.trim())throw new Error("Informe o número do crachá.");if(password.length<8||!/[A-Z]/.test(password)||!/[0-9]/.test(password))throw new Error("A senha deve ter ao menos 8 caracteres, uma letra maiúscula e um número.");
  if(database().profiles.some(item=>item.id!==profile.id&&item.cracha===cracha.trim()))throw new Error("Este número de crachá já está vinculado a outro usuário.");
  profile.cracha=cracha.trim();profile.status="ativo";profile.primeiro_acesso_concluido=true;profile.updated_at=new Date().toISOString();database().credentials[profile.id]=hashPassword(password);delete database().invites[token];return {profile,sessionToken:createSession(profile.id)};
}
export function createReset(identifier:string){
  const normalized=identifier.trim().toLowerCase();const profile=database().profiles.find(item=>item.email.toLowerCase()===normalized||item.cracha===identifier.trim()||item.matricula===identifier.trim());
  if(!profile||profile.status!=="ativo")return undefined;const token=randomBytes(24).toString("hex");database().resets[token]={userId:profile.id,expiresAt:Date.now()+1000*60*30};return token;
}
export function resetPassword(token:string,password:string){
  const record=database().resets[token];if(!record||record.expiresAt<Date.now())throw new Error("Token inválido ou expirado.");
  if(password.length<8||!/[A-Z]/.test(password)||!/[0-9]/.test(password))throw new Error("A senha deve ter ao menos 8 caracteres, uma letra maiúscula e um número.");
  database().credentials[record.userId]=hashPassword(password);delete database().resets[token];return getProfile(record.userId)!;
}
export function adminResetPassword(requester:AccessUser,userId:string){
  if(requester.perfil!=="Administrador")throw new Error("Ação exclusiva do Administrador.");const profile=getProfile(userId);if(!profile)throw new Error("Usuário não encontrado.");
  const temporary=`Temp${Math.floor(100000+Math.random()*900000)}A`;database().credentials[userId]=hashPassword(temporary);profile.status="ativo";return temporary;
}
