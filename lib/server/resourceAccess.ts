import "server-only";
import { NextResponse } from "next/server";
import { filterAccessibleMesaItems } from "@/lib/server/accessStore";
import { getSessionUser } from "@/lib/server/session";

export async function filteredResourceResponse<T extends {mesa:string}>(items:T[]){
  const user=await getSessionUser();
  if(!user)return NextResponse.json({error:"Sessão não autenticada."},{status:401});
  return NextResponse.json(filterAccessibleMesaItems(user,items));
}
