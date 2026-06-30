import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";
import { canAccessMesa, trainingMesas } from "@/lib/server/accessStore";
import { mockAulas } from "@/data/mockAulas";
import { mockIts } from "@/data/mockIts";
import { mockFluxogramas } from "@/data/mockFluxogramas";
import { mockDdds } from "@/data/mockDdds";
import { mockTrilhas } from "@/data/mockTrilhas";

export async function GET(request:Request){
  const user=await getSessionUser();
  if(!user)return NextResponse.json({error:"Sessão não autenticada."},{status:401});
  const mesaId=new URL(request.url).searchParams.get("mesaId")||"";
  const mesa=trainingMesas.find(item=>item.id===mesaId);
  if(!mesa)return NextResponse.json({error:"Mesa não encontrada."},{status:404});
  if(!canAccessMesa(user,mesaId)){
    return NextResponse.json({error:"Acesso não autorizado. Esta mesa ainda não foi liberada para seu treinamento."},{status:403});
  }
  return NextResponse.json({
    mesa,
    aulas:mockAulas.filter(item=>item.mesa===mesa.nome),
    its:mockIts.filter(item=>item.mesa===mesa.nome),
    fluxos:mockFluxogramas.filter(item=>item.mesa===mesa.nome),
    ddds:mockDdds.filter(item=>item.mesa===mesa.nome),
    trilha:mockTrilhas.find(item=>item.mesa===mesa.nome)||null,
  });
}
