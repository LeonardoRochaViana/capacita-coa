import { NextResponse } from "next/server";
import { createEmployee, listProfiles, updateEmployee } from "@/lib/server/accessStore";
import { getSessionUser } from "@/lib/server/session";
import type { EmployeeProfile } from "@/types";

export async function GET(){
  const requester=await getSessionUser();
  if(!requester)return NextResponse.json({error:"Sessão não autenticada."},{status:401});
  if(requester.perfil==="Aluno")return NextResponse.json({error:"Acesso não autorizado."},{status:403});
  return NextResponse.json({users:listProfiles(requester)});
}

export async function POST(request:Request){
  const requester=await getSessionUser();
  if(!requester)return NextResponse.json({error:"Sessão não autenticada."},{status:401});
  try{return NextResponse.json({user:createEmployee(requester,await request.json())},{status:201});}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Não foi possível cadastrar o colaborador."},{status:403});}
}

export async function PATCH(request:Request){
  const requester=await getSessionUser();
  if(!requester)return NextResponse.json({error:"Sessão não autenticada."},{status:401});
  const body=await request.json() as {userId:string;patch:Partial<EmployeeProfile>};
  try{return NextResponse.json({user:updateEmployee(requester,body.userId,body.patch)});}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Não foi possível atualizar o colaborador."},{status:403});}
}
