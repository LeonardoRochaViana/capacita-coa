import { mockCertificados } from "@/data/mockCertificados";
import { filteredResourceResponse } from "@/lib/server/resourceAccess";
export async function GET(){return filteredResourceResponse(mockCertificados);}
