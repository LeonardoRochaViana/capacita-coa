import { mockChecklists } from "@/data/mockChecklists";
import { filteredResourceResponse } from "@/lib/server/resourceAccess";
export async function GET(){return filteredResourceResponse(mockChecklists);}
