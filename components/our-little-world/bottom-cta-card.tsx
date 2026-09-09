import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BottomCtaCard = () => {
  return (
    <Card className="mt-4 overflow-hidden">
      <CardContent className="flex items-center justify-between gap-4 p-4 md:p-5">
        <div>
          <h3 className="font-semibold">Need ideas for your Anniversary?</h3>

          <p className="mt-1 text-xs text-muted-foreground">
            We&apos;ve handpicked some special ideas for you.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <Button size="sm">Explore Ideas</Button>

          {/* <Gift className="hidden size-12 text-primary/50 sm:block" /> */}
        </div>
      </CardContent>
    </Card>
  );
}

export default BottomCtaCard
