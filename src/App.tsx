import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { BottomNavigation } from "./components/layout/BottomNavigation";

import { CalendarPage } from "./pages/calendar/CalendarPage";
import { HomePage } from "./pages/home/HomePage";
import { SearchPage } from "./pages/home/SearchPage";
import { MyPage } from "./pages/mypage/MyPage";
import { TaskPlaylistPage } from "./pages/task-playlist/TaskPlaylistPage";

import { TaskRecommendationsPage } from "./components/task/TaskRecommendationsPage";

const PAGES_WITHOUT_BOTTOM_NAVIGATION = [
  "/task-recommendations",
];

function App() {
  const location = useLocation();

  const hasBottomNavigation =
    !PAGES_WITHOUT_BOTTOM_NAVIGATION.includes(
      location.pathname,
    );

  return (
    <>
      <main
        className={
          hasBottomNavigation
            ? "min-h-screen pb-[calc(90px+env(safe-area-inset-bottom))]"
            : "min-h-screen"
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/calendar"
            element={<CalendarPage />}
          />

          <Route
            path="/mypage"
            element={<MyPage />}
          />

          <Route
            path="/home/search"
            element={<SearchPage />}
          />

          <Route
            path="/task-playlist"
            element={<TaskPlaylistPage />}
          />

          <Route
            path="/task-recommendations"
            element={<TaskRecommendationsPage />}
          />
        </Routes>
      </main>

      {hasBottomNavigation && <BottomNavigation />}
    </>
  );
}

export default App;