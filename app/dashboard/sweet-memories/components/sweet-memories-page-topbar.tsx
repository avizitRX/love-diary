import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react'

const SweetMemoriesPageTopbar = () => {
  return (
    <div className="flex justify-between">
      {/* Greetings */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Sweet Memories
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          All the beautiful moments
        </p>
      </div>

      {/* Add New Button */}
      <div className="gap-3">
        <Button size="lg" className="gap-2">
          <Plus className="size-5" />
          Add Memory
        </Button>
      </div>
    </div>
  );
}

export default SweetMemoriesPageTopbar;
