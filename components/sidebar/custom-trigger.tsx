'use client';
import { useSidebar } from "@/components/ui/sidebar";
import { MenuIcon } from "lucide-react";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return <button onClick={toggleSidebar}>
    <MenuIcon />
  </button>;
}
