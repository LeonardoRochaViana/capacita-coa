import { mockIts } from "@/data/mockIts";
import { filteredResourceResponse } from "@/lib/server/resourceAccess";
export async function GET(){return filteredResourceResponse(mockIts);}
