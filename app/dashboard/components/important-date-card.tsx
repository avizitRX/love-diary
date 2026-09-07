import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarHeart, Gift } from 'lucide-react';
import React from 'react'

const ImportantDateCard = () => {
  return (
      <Card>
        <CardContent className="relative p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarHeart className="size-5" />
            </div>

            <div>
              <p className="text-xs font-semibold text-primary">
                Next Important Date
              </p>

              <h2 className="mt-2 text-base font-semibold">Our Anniversary</h2>

              <p className="mt-1 text-sm text-muted-foreground">In 7 days</p>

              <p className="mt-1 text-xs text-muted-foreground">
                August 30, 2026 (Sunday)
              </p>
            </div>
          </div>

          <Button size="sm" className="mt-4">
            View Ideas
          </Button>

          <div className="absolute bottom-3 right-5">
            <Gift className="size-16 text-primary/40" />
          </div>
        </CardContent>
      </Card>
  );
}

export default ImportantDateCard
