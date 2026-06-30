import { DDD } from "@/types";
// Fonte temporária local. No ambiente final, substituir por SharePoint Lists.
const base = [
["Priorizar Comboio","Mesa do Apoio","Evitar parada operacional por falta de abastecimento."],
["Abertura correta de O.S.","GSA — Gestão de Serviços Agrícolas","Garantir registros completos desde a abertura."],
["Justificativa correta do T2","Monitoramento Performance","Qualificar o registro do tempo de carregamento."],
["Distribuição de frota no campo","Logística Clementina","Evitar falta de caminhão no campo."],
["Distribuição de frota na indústria","Logística Queiroz","Evitar falta de caminhão na indústria."],
["Equipamento com O.S. aberta","Monitoramento Manutenção C.T.T. Clementina","Impedir operação com manutenção pendente."],
["Requisição correta na O.S.","Monitoramento Manutenção C.T.T. Queiroz","Garantir rastreabilidade dos materiais."],
["Comunicação e passagem de turno","Geral COA","Assegurar continuidade entre equipes."]
];
export const mockDdds: DDD[] = base.map(([tema,mesa,objetivo],i)=>({id:String(i+1),tema,mesa,objetivo,conteudo:i===0?"Antes de direcionar um comboio, avalie criticidade da frente, nível de combustível, distância, risco de parada e impacto operacional.":"A decisão deve seguir o procedimento oficial, considerar o risco operacional e ser registrada com clareza.",situacao:i===0?"Duas frentes solicitam abastecimento ao mesmo tempo, mas uma está com risco de parada.":"Uma demanda urgente chega com informações incompletas durante o turno.",pergunta:i===0?"O atendimento deve seguir apenas a ordem de solicitação?":"Qual é a conduta mais segura?",alternativas:i===0?["Sim, sempre pela ordem de chegada","Não, deve considerar criticidade operacional","Apenas conforme escolha do motorista","Aguardar o fim do turno"]:["Executar sem validar","Validar, priorizar pelo risco e registrar","Ignorar a demanda","Transferir sem contexto"],correta:1}));
