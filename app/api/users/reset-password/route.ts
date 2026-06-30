import { NextResponse } from "next/server";
import { adminResetPassword } from "@/lib/server/accessStore";
import { getSessionUser } from "@/lib/server/session";

export async function POST(request:Request){
  const requester=await getSessionUser();
  if(!requester)return NextResponse.json({error:"Sessão não autenticada."},{status:401});
  const {userId}=await request.json() as {userId:string};
  try{return NextResponse.json({temporaryPassword:adminResetPassword(requester,userId)});}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Não foi possível redefinir a senha."},{status:403});}
}
