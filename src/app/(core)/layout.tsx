"use client";

import CoreLayoutWrapper from "@/components/layout/core-layout-wrapper";
import Footer from "@/components/footer";

interface CoreLayoutProps {
  children: React.ReactNode;
}

export default function CoreLayout({ children }: CoreLayoutProps) {
  return (
    <CoreLayoutWrapper>
      {children}
      <Footer />
    </CoreLayoutWrapper>
  );
}
