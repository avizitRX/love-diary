import React from 'react';
import Image from "next/image";
import DaysTogetherBackground from "@/public/stock-images/days-together-background.jpg";
import { Card } from '@/components/ui/card';

const DaysTogetherCard = () => {
  return (
      <Card className="flex flex-col overflow-hidden p-0">
        <div className="relative aspect-[1.45/1] w-full flex-1 overflow-hidden">
          <Image
            src={DaysTogetherBackground}
            alt="Days together"
            placeholder="blur"
            fill
            className="object-cover object-[50%_30%]"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 text-center text-white">
            <p className="text-5xl font-bold tracking-tight md:text-6xl">
              1,284
            </p>

            <p className="mt-1 text-lg font-medium">Days Together ❤️</p>

            <p className="mt-2 text-sm opacity-90">Since March 12, 2022</p>
          </div>
        </div>
      </Card>
  );
}

export default DaysTogetherCard
