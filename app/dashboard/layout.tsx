import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { CustomTrigger } from "@/components/sidebar/custom-trigger";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
