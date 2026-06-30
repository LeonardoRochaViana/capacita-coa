import { Trilha } from "@/types";
const data: [string,string,string[]][] = [
["Novo Colaborador COA","Geral COA",["Introdução ao COA","Comunicação operacional","Segurança","Regras gerais","DDD","Sistemas utilizados","Simulado final"]],
["GSA","GSA — Gestão de Serviços Agrícolas",["Abertura de O.S.","Encerramento de O.S.","Monitoramento de rastros","Comunicação com líderes","Simulado final"]],
["Monitoramento Performance","Monitoramento Performance",["Monitoramento C.T.T.","Justificativa de T2","Relatório de velocidade","Alerta acima de 82 km/h","Simulado final"]],
["Logística Clementina","Logística Clementina",["Distribuição de frota","Criação de rotas","Ordem de Corte","Campo x indústria","Simulado final"]],
["Logística Queiroz","Logística Queiroz",["Distribuição de frota","Criação de rotas","Ordem de Corte","Campo x indústria","Simulado final"]],
["Manutenção C.T.T. Clementina","Monitoramento Manutenção C.T.T. Clementina",["Abertura de O.S.","Encerramento de O.S.","Requisições","Previsão com líderes","O.S. aberta","Simulado final"]],
["Manutenção C.T.T. Queiroz","Monitoramento Manutenção C.T.T. Queiroz",["Abertura de O.S.","Encerramento de O.S.","Requisições","Previsão com líderes","O.S. aberta","Simulado final"]],
["Mesa do Apoio","Mesa do Apoio",["Prancha","Munck","Comboio","Triângulo de emergência","Foco de incêndio","Boletim de incêndio","Chuva","Simulado final"]]
];
export const mockTrilhas: Trilha[] = data.map(([nome,mesa,etapas],i)=>({nome,mesa,etapas,progresso:i===7?38:i===0?72:20+i*5}));
