'use client';

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
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  {
    label: "Our Little World",
    icon: Home,
  },
  {
    label: "Sweet Memories",
    icon: Heart,
  },
  {
    label: "Special Days",
    icon: CalendarHeart,
  },
  {
    label: "Our Love Story",
    icon: Clock3,
  },
  {
    label: "Couple Games",
    icon: Gamepad2,
  },
  {
    label: "Private Notes",
    icon: NotebookPen,
  },
  {
    label: "Notifications",
    icon: Bell,
  },
];

export function AppSidebar() {
  const isMobile = useIsMobile();

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
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.label}>
                <Button
                  variant={index === 0 ? "default" : "ghost"}
                  size="lg"
                  className="w-full justify-start gap-3 px-3 text-left"
                >
                  <Icon className="size-5 shrink-0" />
                  <span>{item.label}</span>
                </Button>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Profile */}
      <SidebarFooter>
        <Button variant={"outline"} size="lg" className="gap-2">
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
                <div className="mb-1 px-2">
                  <p className="font-medium">Alex ♥️ Sarah</p>
                  <p className="text-xs text-muted-foreground">
                    Making memories together
                  </p>
                </div>

                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <UserRoundPen className="size-4" />
                    Edit Profile
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <Settings className="size-4" />
                    Settings
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <HeartHandshake className="size-4" />
                    Our Relationship
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <MessageCircleHeart className="size-4" />
                    Love Preferences
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <Sparkles className="size-4" />
                    Customize Diary
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
