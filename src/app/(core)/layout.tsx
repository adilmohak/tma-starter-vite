"use client";

import CoreLayoutWrapper from "@/components/layout/core-layout-wrapper";
import BottomNavigation from "@/components/bottom-navigation";

interface CoreLayoutProps {
  children: React.ReactNode;
}

export default function CoreLayout({ children }: CoreLayoutProps) {
  return (
    <CoreLayoutWrapper>
      {children}
      <BottomNavigation />
    </CoreLayoutWrapper>
  );
}
