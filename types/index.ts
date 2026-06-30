export type Status = "Concluído" | "Pendente" | "Em andamento" | "Atenção" | "Vencido" | "Ativo";

export interface User { nome: string; email: string; unidade: string; turno: string; mesa: string; perfil: string; }
export interface Mesa { id: string; nome: string; short: string; descricao: string; responsabilidades: string[]; cor: string; }
export interface Aula { id: string; titulo: string; mesa: string; objetivo: string; tempo: number; nivel: string; status: Status; progresso: number; }
export interface ITProcedimento { id: string; nome: string; mesa: string; codigo: string; versao: string; atualizacao: string; status: Status; resumo: string; }
export interface Fluxograma { id: string; nome: string; mesa: string; objetivo: string; entrada: string; saida: string; sistemas: string[]; responsaveis: string[]; riscos: string[]; indicador: string; etapas: string[]; }
export interface Checklist { id: string; nome: string; mesa: string; itens: string[]; }
export interface DDD { id: string; tema: string; mesa: string; objetivo: string; conteudo: string; situacao: string; pergunta: string; alternativas: string[]; correta: number; }
export interface Pergunta { enunciado: string; alternativas: string[]; correta: number; explicacao: string; tema: string; nivel: string; procedimento: string; }
export interface Simulado { id: string; nome: string; mesa: string; perguntas: Pergunta[]; }
export interface Historico { tipo: string; nome: string; mesa: string; status: Status; nota?: string; data?: string; validade?: string; }
export interface Certificado { nome: string; capacitacao: string; mesa: string; nota: string; conclusao: string; validade: string; status: Status; }
export interface Trilha { nome: string; mesa: string; etapas: string[]; progresso: number; }
export interface IndicadorGestor { label: string; valor: string; variacao?: string; }
export type AccessRole = "Aluno" | "Gestor" | "Administrador";
export interface AccessUser extends User { id: string; perfil: AccessRole; }
export interface ManagedDDD extends DDD {
  data: string;
  responsavel: string;
  unidade: string;
  turno: string;
  status: "Rascunho" | "Publicado" | "Inativo";
}
export type MesaPermissionStatus = "liberado" | "bloqueado" | "concluido";
export interface UserTablePermission {
  id: string;
  user_id: string;
  mesa_id: string;
  liberado_por: string;
  data_liberacao: string;
  status: MesaPermissionStatus;
  observacao: string;
}
export interface AccessibleResourcePayload<T> {
  items: T[];
  mesas: string[];
  all: boolean;
}
export type AccountStatus = "aguardando_configuracao" | "aguardando_primeiro_acesso" | "ativo" | "bloqueado" | "inativo";
export interface EmployeeProfile extends AccessUser {
  cracha?: string;
  matricula?: string;
  setor: string;
  funcao: string;
  gestor_id?: string;
  status: AccountStatus;
  primeiro_acesso_concluido: boolean;
  observacao?: string;
  data_prevista_inicio?: string;
  created_at: string;
  updated_at: string;
}
