import { CustomTrigger } from '@/components/sidebar/custom-trigger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';
import React from 'react'

const TopBar = () => {
  return (
    <div>
      <header className="mb-6 flex items-center justify-between lg:justify-end gap-4">
        <div className="block lg:hidden">
          <CustomTrigger />
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="size-5" />

            <Badge
              variant="default"
              className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[9px]"
            >
              3
            </Badge>
          </Button>

          <Button className="gap-2">
            <Plus className="size-4" />
            Add New
          </Button>
        </div>
      </header>

      {/* Hero Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Good morning, Alex ❤️
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Cherish every moment together.
        </p>
      </div>
    </div>
  );
}

export default TopBar
