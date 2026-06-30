import { Aula } from "@/types";
// Fonte temporária local. No ambiente final, substituir por SharePoint Lists.
const porMesa: Record<string,string[]> = {
  "GSA — Gestão de Serviços Agrícolas":["Abertura de O.S. de manutenção","Encerramento de O.S. de manutenção","Monitoramento de rastros","Comunicação com líderes do campo"],
  "Monitoramento Performance":["Justificativa do T2","Monitoramento de equipamentos C.T.T.","Relatório de velocidade acima de 82 km/h","Tratativa de desvios de performance"],
  "Logística Clementina":["Distribuição de frota de transporte","Criação de rotas","Abertura de Ordem de Corte","Tratativa de falta de caminhão no campo"],
  "Logística Queiroz":["Distribuição de frota de transporte","Criação de rotas","Abertura de Ordem de Corte","Tratativa de falta de caminhão na indústria"],
  "Monitoramento Manutenção C.T.T. Clementina":["Abertura de O.S. C.T.T.","Encerramento de O.S. C.T.T.","Requisições na O.S.","Equipamento com O.S. aberta"],
  "Monitoramento Manutenção C.T.T. Queiroz":["Abertura de O.S. C.T.T.","Encerramento de O.S. C.T.T.","Requisições na O.S.","Equipamento com O.S. aberta"],
  "Mesa do Apoio":["Agendamento de Frete de Prancha","Solicitação e acompanhamento de munck","Controle de comboios","Fluxo de foco de incêndio","Lançamento de chuva nas frentes","Passagem de turno"],
  "Geral COA":["Comunicação operacional","Dever de recusa","Segurança operacional","Passagem de turno"],
};
export const mockAulas: Aula[] = Object.entries(porMesa).flatMap(([mesa, titulos],mi)=>titulos.map((titulo,i)=>({
  id: `${mi}-${i}`, titulo, mesa, objetivo:`Executar ${titulo.toLowerCase()} com segurança, padronização e rastreabilidade.`, tempo:i===0&&mesa==="Mesa do Apoio"?15:12+i*3, nivel:i<2?"Básico":"Intermediário", status:(i===0?"Pendente":i===1?"Em andamento":"Concluído") as Aula["status"], progresso:i===0?0:i===1?55:100
})));
