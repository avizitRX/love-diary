import { CustomTrigger } from "@/components/sidebar/custom-trigger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Heart, Plus } from "lucide-react";
import Logo from "../branding/logo";

const TopBar = () => {
  return (
    <div>
      <header className="md:hidden mb-6 flex items-center justify-between gap-4">
        {/* Mobile Logo / Desktop empty or alternate space */}
        <Logo />

        {/* Right side actions */}
        <div className="flex items-center gap-3">
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
