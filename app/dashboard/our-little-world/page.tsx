import DaysTogetherCard from "./components/days-together-card";
import ImportantDateCard from "./components/important-date-card";
import MessageCard from "./components/message-card";
import OnThisDayCard from "./components/on-this-day-card";
import UpcomingDatesCard from "./components/upcoming-dates-card";
import BottomCtaCard from "./components/bottom-cta-card";
import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OurLittleWorldPage() {
  return (
    <>
      {/* Hero Header */}
      <div className="flex justify-between items-baseline">
        {/* Greetings */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Good morning, Alex ❤️
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Cherish every moment together.
          </p>
        </div>

        {/* Desktop-only action buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="size-6" />
            <Badge
              variant="default"
              className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full p-0 text-[9px]"
            >
              3
            </Badge>
          </Button>

          <Button size="lg" className="gap-2">
            <Plus className="size-5" />
            Add New
          </Button>
        </div>
      </div>

      {/* =========================================================
            HERO GRID
        ========================================================= */}
      <section className="grid gap-4 lg:grid-cols-2">
        {/* Left column */}
        <DaysTogetherCard />

        {/* Right column */}
        <div className="grid gap-4">
          <MessageCard />
          <ImportantDateCard />
        </div>
      </section>

      {/* =========================================================
            SECOND ROW
        ========================================================= */}
      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <UpcomingDatesCard />
        <OnThisDayCard />
        {/* <QuickActionsCard /> */}
        {/* <RecentMemoriesCard /> */}
      </section>

      {/* =========================================================
            BOTTOM CTA
        ========================================================= */}
      <BottomCtaCard />
    </>
  );
}
