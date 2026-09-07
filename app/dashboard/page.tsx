import DaysTogetherCard from "./components/days-together-card";
import ImportantDateCard from "./components/important-date-card";
import MessageCard from "./components/message-card";
import OnThisDayCard from "./components/on-this-day-card";
import QuickActionsCard from "./components/quick-actions-card";
import UpcomingDatesCard from "./components/upcoming-dates-card";
import RecentMemoriesCard from "./components/recent-memories-card";
import BottomCtaCard from "./components/bottom-cta-card";
import TopBar from "./components/top-bar";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        {/* =========================================================
            TOP BAR
        ========================================================= */}
        <TopBar />

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
          <OnThisDayCard />
          <QuickActionsCard />
        </section>

        {/* =========================================================
            THIRD ROW
        ========================================================= */}
        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <UpcomingDatesCard />
          <RecentMemoriesCard />
        </section>

        {/* =========================================================
            BOTTOM CTA
        ========================================================= */}
        <BottomCtaCard />
      </div>
    </main>
  );
}
