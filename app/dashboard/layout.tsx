import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import TopBar from "./our-little-world/components/top-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            <TopBar />

            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
