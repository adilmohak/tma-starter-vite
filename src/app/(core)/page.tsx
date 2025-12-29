"use client";

import SupportCard from "@/components/support-card";

export default function HomePage() {
  return (
    <section className="app-container flex flex-col">
      <div className="flex flex-col gap-2 w-full flex-grow px-3 pb-[100px] pt-[65px] relative h-full">
        <div className="text-center text-4xl font-bold">TMA Starter</div>
        <p className="text-center text-secondary">
          Telegram Mini App Starter Template
        </p>
        <div className="mt-auto">
          <SupportCard />
        </div>
      </div>
    </section>
  );
}
