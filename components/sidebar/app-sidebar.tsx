import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { ChevronDown, HomeIcon, Icon, Plus, ProjectorIcon, User2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem key="sidebar-menu-key-1">
            <SidebarMenuButton render={<a href="#" />} isActive>
              <HomeIcon />
              <span>Button 1</span>
            </SidebarMenuButton>

            <SidebarMenuBadge>24</SidebarMenuBadge>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User2 /> Username
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
