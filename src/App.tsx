import { Route, Routes } from "react-router-dom";

import { BottomNavigation } from "./components/layout/BottomNavigation";
import { HomePage } from "./pages/home/HomePage";
import { CalendarPage } from "./pages/calendar/CalendarPage";
import { MyPage } from "./pages/mypage/MyPage";
import { CompletedTask } from "./pages/mypage/CompletedTask";

function App() {
  return (
    <>
      <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/completed-tasks" element={<CompletedTask />} />
        </Routes>
      </main>

      <BottomNavigation />
    </>
  );
}

export default App;
