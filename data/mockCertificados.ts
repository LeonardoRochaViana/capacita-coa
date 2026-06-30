import { Certificado } from "@/types";
const nomes=["Integração COA","Segurança Operacional","Comunicação Operacional","Mesa do Apoio — Fundamentos","Agendamento de Frete de Prancha"];
export const mockCertificados: Certificado[] = nomes.map((capacitacao,i)=>({nome:"Leonardo Viana",capacitacao,mesa:i<3?"Geral COA":"Mesa do Apoio",nota:i===4?"—":`${92-i*2}%`,conclusao:i===4?"Pendente":`${String(4+i).padStart(2,"0")}/0${Math.min(6,i+2)}/2026`,validade:i===4?"—":`${String(4+i).padStart(2,"0")}/0${Math.min(6,i+2)}/2027`,status:i===4?"Pendente":"Concluído"}));
