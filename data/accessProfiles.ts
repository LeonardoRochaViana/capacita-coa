import type { AccessUser } from "@/types";

// Fonte temporária local. No ambiente final, substituir por SharePoint Lists.
export const accessProfiles: AccessUser[] = [
  { id:"aluno", nome:"João Silva", email:"joao.silva@clealco.com.br", perfil:"Aluno", mesa:"Mesa do Apoio", unidade:"Clementina", turno:"B" },
  { id:"gestor", nome:"Leonardo Viana", email:"leonardo.viana@clealco.com.br", perfil:"Gestor", mesa:"Mesa do Apoio", unidade:"Clementina", turno:"B" },
  { id:"admin", nome:"Administrador COA", email:"administrador.coa@clealco.com.br", perfil:"Administrador", mesa:"Geral COA", unidade:"Todas", turno:"Todos" },
];
