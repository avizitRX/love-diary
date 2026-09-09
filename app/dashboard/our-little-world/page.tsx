import DaysTogetherCard from "./components/days-together-card";
import ImportantDateCard from "./components/important-date-card";
import MessageCard from "./components/message-card";
import OnThisDayCard from "./components/on-this-day-card";
import UpcomingDatesCard from "./components/upcoming-dates-card";
import BottomCtaCard from "./components/bottom-cta-card";

export default function Dashboard() {
  return (
    <>
      {/* Hero Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Good morning, Alex ❤️
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Cherish every moment together.
        </p>
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
