import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heart, Gift, CalendarHeart, ChevronRight } from 'lucide-react';
import React from 'react'

const UpcomingDatesCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Upcoming Dates</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <UpcomingDate
          icon={<Heart />}
          title="Our Anniversary"
          date="August 30, 2026"
          remaining="7 days"
        />

        <UpcomingDate
          icon={<Gift />}
          title="Sarah's Birthday"
          date="September 15, 2026"
          remaining="23 days"
        />

        <UpcomingDate
          icon={<CalendarHeart />}
          title="Weekend Trip"
          date="September 28, 2026"
          remaining="36 days"
        />

        <Button variant="link" className="h-auto p-0 text-xs">
          View All Dates
          <ChevronRight className="ml-1 size-3" />
        </Button>
      </CardContent>
    </Card>
  );
}

function UpcomingDate({
  icon,
  title,
  date,
  remaining,
}: {
  icon: React.ReactNode;
  title: string;
  date: string;
  remaining: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary [&>svg]:size-4">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">{title}</p>

        <p className="mt-0.5 text-[11px] text-muted-foreground">{date}</p>
      </div>

      <span className="text-[11px] font-medium text-muted-foreground">
        {remaining}
      </span>
    </div>
  );
}

export default UpcomingDatesCard
