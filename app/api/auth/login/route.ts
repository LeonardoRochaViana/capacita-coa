import { NextResponse } from "next/server";
import { authenticate } from "@/lib/server/accessStore";

export async function POST(request:Request){
  const {identifier,password}=await request.json() as {identifier?:string;password?:string};
  if(!identifier||!password)return NextResponse.json({error:"Informe seu e-mail, crachá ou matrícula e sua senha."},{status:400});
  const result=authenticate(identifier,password);
  if("error" in result)return NextResponse.json(result,{status:result.status});
  const response=NextResponse.json({user:result.profile});
  response.cookies.set("capacita-session",result.token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*8});
  return response;
}
