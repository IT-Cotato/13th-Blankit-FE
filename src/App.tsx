import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";

import { BottomNavigation } from "./components/layout/BottomNavigation";
import { CurrentTaskMiniPlayer } from "./components/task-combination/CurrentTaskMiniPlayer";

import { CalendarPage } from "./pages/calendar/CalendarPage";
import { HomePage } from "./pages/home/HomePage";
import { SearchPage } from "./pages/home/SearchPage";
import { TaskRecommendationsPage } from "./pages/home/TaskRecommendationsPage";
import { CompletedTask } from "./pages/mypage/CompletedTask";
import { MyPage } from "./pages/mypage/MyPage";
import { TaskPlaylistPage } from "./pages/task-playlist/TaskPlaylistPage";

import { TaskCombinationDetailPage } from "./pages/home/TaskCombinationDetailPage";
import { usePlaylistStore } from "./store/usePlaylistStore";
import { shouldShowCurrentTaskMiniPlayer } from "./utils/currentTaskMiniPlayerRoutes";
import { SplashScreen } from "./components/splash/SplashScreen";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { LoginPage } from "./pages/login/LoginPage";

const PAGES_WITHOUT_BOTTOM_NAVIGATION = [
    "/mypage/completed-tasks",
    "/task-recommendations",
    "/onboarding",
    "/login",
];

function App() {
  const location = useLocation();
  const [isAppReady, setIsAppReady] = useState(false);

  const hasBottomNavigation =
    !PAGES_WITHOUT_BOTTOM_NAVIGATION.includes(
      location.pathname,
    );

  const currentPlaylistTask = usePlaylistStore(
    (state) => state.playlist[0],
  );

  const handleSplashFinish = () => {
    setIsAppReady(true);
  };

  if (!isAppReady) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }
  
  const hasCurrentTaskMiniPlayer =
    Boolean(currentPlaylistTask) &&
    shouldShowCurrentTaskMiniPlayer(location.pathname) &&
    !PAGES_WITHOUT_BOTTOM_NAVIGATION.includes(
      location.pathname,
    );

  return (
    <>
      <main
        className={
          hasCurrentTaskMiniPlayer
            ? "min-h-screen pb-[calc(170px+env(safe-area-inset-bottom))]"
            : hasBottomNavigation
              ? "min-h-screen pb-[calc(90px+env(safe-area-inset-bottom))]"
              : "min-h-screen"
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route
            path="/mypage/completed-tasks"
            element={<CompletedTask />}
          />
          <Route path="/home/search" element={<SearchPage />} />
          <Route path="/task-playlist" element={<TaskPlaylistPage />} />
          <Route
            path="/task-recommendations"
            element={<TaskRecommendationsPage />}
          />

          <Route
            path="/task-combinations/:modeId"
            element={<TaskCombinationDetailPage />}
          />

          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {hasBottomNavigation && <BottomNavigation />}

      {hasCurrentTaskMiniPlayer && currentPlaylistTask && (
        <CurrentTaskMiniPlayer task={currentPlaylistTask} />
      )}
    </>
  );
}

export default App;
