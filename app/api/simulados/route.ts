import { mockSimulados } from "@/data/mockSimulados";
import { filteredResourceResponse } from "@/lib/server/resourceAccess";
export async function GET(){return filteredResourceResponse(mockSimulados);}
