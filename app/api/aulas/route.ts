import { mockAulas } from "@/data/mockAulas";
import { filteredResourceResponse } from "@/lib/server/resourceAccess";
export async function GET(){return filteredResourceResponse(mockAulas);}
