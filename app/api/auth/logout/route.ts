import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revokeSession } from "@/lib/server/accessStore";

export async function POST(){
  const store=await cookies();
  revokeSession(store.get("capacita-session")?.value);
  const response=NextResponse.json({ok:true});
  response.cookies.set("capacita-session","",{httpOnly:true,path:"/",maxAge:0});
  return response;
}
