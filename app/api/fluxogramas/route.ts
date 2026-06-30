import { mockFluxogramas } from "@/data/mockFluxogramas";
import { filteredResourceResponse } from "@/lib/server/resourceAccess";
export async function GET(){return filteredResourceResponse(mockFluxogramas);}
