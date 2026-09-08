import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'

const OnThisDayCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {/* <Calendar className="size-4 text-primary" /> */}
          On This Day
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-xs text-muted-foreground">Aug 23, 2023</p>

        <h3 className="mt-2 font-semibold">
          Our first trip to Cox&apos;s Bazar
        </h3>

        {/* Memory thumbnails */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <img
            src="/images/memory-1.jpg"
            alt=""
            className="aspect-[1.5/1] rounded-lg object-cover"
          />

          <img
            src="/images/memory-2.jpg"
            alt=""
            className="aspect-[1.5/1] rounded-lg object-cover"
          />

          <img
            src="/images/memory-3.jpg"
            alt=""
            className="aspect-[1.5/1] rounded-lg object-cover"
          />
        </div>

        <Button variant="secondary" size="sm" className="mt-3">
          View Memory
        </Button>
      </CardContent>
    </Card>
  );
}

export default OnThisDayCard;
