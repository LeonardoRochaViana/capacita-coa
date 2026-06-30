import { NextResponse } from "next/server";
import { createInvite } from "@/lib/server/accessStore";
import { getSessionUser } from "@/lib/server/session";

export async function POST(request:Request){
  const requester=await getSessionUser();
  if(!requester)return NextResponse.json({error:"Sessão não autenticada."},{status:401});
  const {userId}=await request.json() as {userId:string};
  try{
    const token=createInvite(requester,userId);
    return NextResponse.json({invitePath:`/primeiro-acesso?token=${token}`});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Não foi possível gerar o primeiro acesso."},{status:403});}
}
