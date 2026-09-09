import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CalendarHeart, Gift } from 'lucide-react';
import Image from 'next/image';
import GiftBox from "@/public/illustrations/gift-box.png";

const ImportantDateCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-sm">
          {/* <Calendar className="size-4 text-primary" /> */}
          Next Important Date
        </CardTitle>
      </CardHeader>

      <CardContent className="relative px-5 py-2">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarHeart className="size-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold">Our Anniversary</h2>

            <p className="mt-1 text-sm text-muted-foreground">In 7 days</p>

            <p className="mt-1 text-xs text-muted-foreground">
              August 30, 2026 (Sunday)
            </p>

            <Button variant="secondary" size="sm" className="mt-4">
              View Ideas
            </Button>
          </div>
        </div>

        <div className="hidden md:block absolute -bottom-3 right-4">
          <Image src={GiftBox} height={80} alt="Gift Box Icon" />
        </div>
      </CardContent>
    </Card>
  );
}

export default ImportantDateCard
