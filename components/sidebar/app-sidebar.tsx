"use client";

import {
  CalendarHeart,
  Heart,
  HeartHandshake,
  Home,
  NotebookPen,
  MessageCircleHeart,
  Settings,
  Sparkles,
  Gamepad2,
  Clock3,
  UserRoundPen,
  MoreHorizontal,
  Bell,
  Plus,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  link: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Our Little World",
    icon: Home,
    link: "/dashboard/our-little-world",
  },
  {
    label: "Sweet Memories",
    icon: Heart,
    link: "/dashboard/sweet-memories",
  },
  {
    label: "Special Days",
    icon: CalendarHeart,
    link: "/dashboard/special-days",
  },
  {
    label: "Our Love Story",
    icon: Clock3,
    link: "/dashboard/our-love-story",
  },
  {
    label: "Couple Games",
    icon: Gamepad2,
    link: "/dashboard/couple-games",
  },
  {
    label: "Private Notes",
    icon: NotebookPen,
    link: "/dashboard/private-notes",
  },
];

const profileActions = [
  { label: "Edit Profile", icon: UserRoundPen },
  { label: "Settings", icon: Settings },
  { label: "Our Relationship", icon: HeartHandshake },
  { label: "Love Preferences", icon: MessageCircleHeart },
  { label: "Customize Diary", icon: Sparkles },
];

export function AppSidebar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" side={isMobile ? "right" : "left"}>
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
            <Heart className="size-5 fill-primary text-primary" />
          </div>
          <div>
            <h1 className="font-semibold leading-none">Love Diary</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Our story, together ♡
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarMenu className="gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.link;

            return (
              <SidebarMenuItem key={item.label}>
                <Link href={item.link}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="lg"
                    className="w-full justify-start gap-3 px-3 text-left"
                  >
                    <Icon className="size-5 shrink-0" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              </SidebarMenuItem>
            );
          })}

          <SidebarMenuItem className="block md:hidden">
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start gap-3 px-3 text-left"
            >
              <Bell className="size-5 shrink-0" />
              <span>Notifications</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Profile */}
      <SidebarFooter>
        <Button variant="outline" size="lg" className="gap-2 md:hidden">
          <Plus className="size-5" />
          Add New
        </Button>

        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 px-3 py-3 text-left"
                  />
                }
              >
                <Avatar className="size-10">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Profile Picture"
                    className="grayscale"
                  />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">Alex ♥️ Sarah</p>
                  <p className="text-xs text-muted-foreground">Edit Profile</p>
                </div>

                <MoreHorizontal className="size-4 shrink-0 text-muted-foreground" />
              </PopoverTrigger>

              <PopoverContent side="right" align="end" className="w-64 p-2">
                <div className="mb-1 px-2 py-1">
                  <p className="font-medium">Alex ♥️ Sarah</p>
                  <p className="text-xs text-muted-foreground">
                    Making memories together
                  </p>
                </div>

                <div className="space-y-1">
                  {profileActions.map((action) => {
                    const ActionIcon = action.icon;
                    return (
                      <Button
                        key={action.label}
                        variant="ghost"
                        className="w-full justify-start gap-3"
                      >
                        <ActionIcon className="size-4" />
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
