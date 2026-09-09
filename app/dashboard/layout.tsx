import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import TopBar from "../../components/our-little-world/top-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main>
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            <TopBar />

            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
