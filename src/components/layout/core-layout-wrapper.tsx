"use client";

interface CoreLayoutWrapperProps {
  children: React.ReactNode;
}

export default function CoreLayoutWrapper({
  children,
}: CoreLayoutWrapperProps) {
  return <section className="pb-20">{children}</section>;
}

