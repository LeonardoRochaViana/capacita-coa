import { NextResponse } from "next/server";
import { createReset } from "@/lib/server/accessStore";

export async function POST(request:Request){
  const {identifier}=await request.json() as {identifier?:string};
  const token=identifier?createReset(identifier):undefined;
  // Apenas no desenvolvimento local. Em produção, o link deve ser enviado por e-mail/SMS
  // ao titular da conta e nunca retornado diretamente pela API.
  const resetPath=process.env.NODE_ENV!=="production"&&token?`/recuperar-senha?token=${token}`:undefined;
  return NextResponse.json({
    message:"Se os dados estiverem ativos no portal, as instruções de recuperação serão disponibilizadas.",
    resetPath,
  });
}
