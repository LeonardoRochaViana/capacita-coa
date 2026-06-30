import { NextResponse } from "next/server";
import { completeFirstAccess, validateInvite } from "@/lib/server/accessStore";

export async function GET(request:Request){
  const token=new URL(request.url).searchParams.get("token")||"";
  const profile=validateInvite(token);
  return profile?NextResponse.json({name:profile.nome,email:profile.email}):NextResponse.json({error:"Convite inválido ou expirado."},{status:404});
}

export async function POST(request:Request){
  const {token,cracha,password,confirmation}=await request.json() as {token:string;cracha:string;password:string;confirmation:string};
  if(password!==confirmation)return NextResponse.json({error:"As senhas não coincidem."},{status:400});
  try{
    const result=completeFirstAccess(token,cracha,password);
    const response=NextResponse.json({user:result.profile});
    response.cookies.set("capacita-session",result.sessionToken,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*8});
    return response;
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"Não foi possível concluir o primeiro acesso."},{status:400});
  }
}
