import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";

export async function GET(){
  const user=await getSessionUser();
  return user?NextResponse.json({user}):NextResponse.json({error:"Sessão não autenticada."},{status:401});
}
