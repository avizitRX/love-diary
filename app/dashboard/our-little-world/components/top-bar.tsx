import { CustomTrigger } from "@/components/sidebar/custom-trigger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Heart, Plus } from "lucide-react";

const TopBar = () => {
  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4">
        {/* Mobile Logo / Desktop empty or alternate space */}
        <div className="flex items-center gap-2">
          <div className="flex lg:hidden items-center font-bold text-lg">
            <div className="flex items-center gap-2 px-2 py-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                <Heart className="size-5 fill-primary text-primary" />
              </div>

              <div>
                <h1 className="font-semibold leading-none">Love Diary</h1>
                <p className="mt-1 text-xs text-muted-foreground font-medium">
                  Our story, together ♡
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Desktop-only action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
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

          {/* Mobile hamburger trigger on the right */}
          <div className="block lg:hidden">
            <CustomTrigger />
          </div>
        </div>
      </header>
    </div>
  );
};

export default TopBar;
