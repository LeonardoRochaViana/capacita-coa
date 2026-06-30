import { AppShell } from "@/components/layout/AppShell";
import { AccessProvider } from "@/components/access/AccessProvider";
export default function PortalLayout({children}:{children:React.ReactNode}) { return <AccessProvider><AppShell>{children}</AppShell></AccessProvider>; }
