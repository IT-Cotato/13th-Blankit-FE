import { HomeTopBar } from "@/components/home/HomeTopBar";
import { WeeklyCalendar } from "@/components/home/WeeklyCalendar";

export function HomePage() {
    return (
      <>
      <HomeTopBar />

      <main className="flex flex-col gap-5 px-5 pt-5">
        <WeeklyCalendar />
      </main>
    </>
    )
  }