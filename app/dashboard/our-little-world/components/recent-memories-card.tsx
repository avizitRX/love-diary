import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React from 'react'

const RecentMemoriesCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm">Recent Memories</CardTitle>

        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          View All
        </Button>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          <RecentMemory
            image="/images/memory-4.jpg"
            title="Sylhet Trip"
            date="June 12, 2026"
          />

          <RecentMemory
            image="/images/memory-5.jpg"
            title="Dinner Date"
            date="Aug 10, 2026"
          />

          <RecentMemory
            image="/images/memory-6.jpg"
            title="Movie Night"
            date="Aug 5, 2026"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function RecentMemory({
  image,
  title,
  date,
}: {
  image: string;
  title: string;
  date: string;
}) {
  return (
    <div className="min-w-0">
      <img
        src={image}
        alt={title}
        className="aspect-[1.25/1] w-full rounded-lg object-cover"
      />

      <p className="mt-2 truncate text-xs font-semibold">{title}</p>

      <p className="mt-0.5 text-[10px] text-muted-foreground">{date}</p>
    </div>
  );
}

export default RecentMemoriesCard
