import { Outlet } from "react-router-dom";
import BottomNavigation from "@/components/bottom-navigation";

export default function CoreLayout() {
  return (
    <section className="pb-20">
      <Outlet />
      <BottomNavigation />
    </section>
  );
}
