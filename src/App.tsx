import { Route, Routes } from "react-router-dom";

import { BottomNavigation } from "./components/layout/BottomNavigation";
import { HomePage } from "./pages/home/HomePage";
import { CalendarPage } from "./pages/calendar/CalendarPage";
import { MyPage } from "./pages/mypage/MyPage";

function App() {
  return (
    <>
      <main className="min-h-screen pb-[calc(90px+env(safe-area-inset-bottom))]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </main>

      <BottomNavigation />
    </>
  );
}

export default App;