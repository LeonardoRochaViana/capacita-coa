import { NextResponse } from "next/server";
import { resetPassword } from "@/lib/server/accessStore";

export async function POST(request:Request){
  const {token,password,confirmation}=await request.json() as {token:string;password:string;confirmation:string};
  if(password!==confirmation)return NextResponse.json({error:"As senhas não coincidem."},{status:400});
  try{return NextResponse.json({user:resetPassword(token,password)});}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Não foi possível redefinir a senha."},{status:400});}
}
