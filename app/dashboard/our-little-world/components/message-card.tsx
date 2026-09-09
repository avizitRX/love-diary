"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Caveat } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoveLetter from "@/public/illustrations/love-letter-white.png";
import Image from "next/image";

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
});

const MessageCard = () => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <Card>
      <CardContent className="relative p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src="/images/sarah.jpg" alt="Sarah" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>

            <div>
              <p className="text-base font-semibold">Sarah</p>
            </div>

            <Badge className="bg-primary text-primary-foreground animate-bounce">
              New
            </Badge>
          </div>

          <span className="text-sm text-muted-foreground">10 min ago</span>
        </div>

        <div className="mt-4 text-center">
          <span
            onClick={() => setIsRevealed(!isRevealed)}
            className={`inline-block cursor-pointer select-none rounded px-2 py-1 transition-all duration-200 ${
              isRevealed
                ? "bg-transparent text-foreground"
                : "bg-muted text-muted-foreground bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-muted-foreground/20 via-muted to-muted-foreground/10 animate-pulse"
            }`}
          >
            <p
              className={`leading-6 ${caveat.className} text-2xl tracking-wide ${!isRevealed && "blur-[6px] select-none hover:blur-xs"}`}
            >
              Can&apos;t wait for our little adventure this weekend! ❤️
            </p>
          </span>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {isRevealed ? "Tap to hide" : "Tap to reveal"}
          </p>
        </div>

        {/* Send Message Button */}
        <div className="mt-4 text-center">
          <Button variant="secondary" size="sm">
            Send Message
          </Button>
        </div>

        <div className="hidden md:block absolute -bottom-3 right-4">
          <Image src={LoveLetter} height={80} alt="Love Letter Icon" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
