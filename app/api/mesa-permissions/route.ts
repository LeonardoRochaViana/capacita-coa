import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";
import { listManageableUsers, listPermissions, setPermission, trainingMesas } from "@/lib/server/accessStore";
import type { MesaPermissionStatus } from "@/types";

export async function GET(){
  const user=await getSessionUser();
  if(!user)return NextResponse.json({error:"Sessão não autenticada."},{status:401});
  return NextResponse.json({
    permissions:listPermissions(user),
    mesas:trainingMesas,
    users:listManageableUsers(user),
    role:user.perfil,
  });
}

export async function POST(request:Request){
  const manager=await getSessionUser();
  if(!manager)return NextResponse.json({error:"Sessão não autenticada."},{status:401});
  if(manager.perfil==="Aluno")return NextResponse.json({error:"Acesso não autorizado."},{status:403});
  const body=await request.json() as {userId:string;mesaId:string;status:MesaPermissionStatus;observacao?:string};
  try {
    return NextResponse.json({permission:setPermission({...body,manager})});
  } catch(error) {
    return NextResponse.json({error:error instanceof Error?error.message:"Falha ao salvar permissão."},{status:403});
  }
}
