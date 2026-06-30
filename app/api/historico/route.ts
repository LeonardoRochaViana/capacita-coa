import { mockHistorico } from "@/data/mockHistorico";
import { filteredResourceResponse } from "@/lib/server/resourceAccess";
export async function GET(){return filteredResourceResponse(mockHistorico);}
