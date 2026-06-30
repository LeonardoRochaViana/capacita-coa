import "server-only";
import { cookies } from "next/headers";
import { getSessionProfile } from "@/lib/server/accessStore";

export async function getSessionUser(){
  const store=await cookies();
  return getSessionProfile(store.get("capacita-session")?.value);
}
