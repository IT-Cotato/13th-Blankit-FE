import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { BottomNavigation } from "./components/layout/BottomNavigation";
import { SplashScreen } from "./components/splash/SplashScreen";
import { CalendarPage } from "./pages/calendar/CalendarPage";
import { HomePage } from "./pages/home/HomePage";
import { SearchPage } from "./pages/home/SearchPage";
import { TaskRecommendationsPage } from "./pages/home/TaskRecommendationsPage";
import { LoginPage } from "./pages/login/LoginPage";
import { CompletedTask } from "./pages/mypage/CompletedTask";
import { MyPage } from "./pages/mypage/MyPage";
import { NotificationSetting } from "./pages/mypage/NotificationSetting";
import { PrioritySetting } from "./pages/mypage/PrioritySetting";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { TaskPlaylistPage } from "./pages/task-playlist/TaskPlaylistPage";

const PAGES_WITHOUT_BOTTOM_NAVIGATION = [
  "/mypage/completed-tasks",
  "/mypage/priority-setting",
  "/mypage/notification-setting",
  "/task-recommendations",
  "/onboarding",
  "/login",
];

function App() {
  const location = useLocation();
  const [isAppReady, setIsAppReady] = useState(false);
  const hasBottomNavigation = !PAGES_WITHOUT_BOTTOM_NAVIGATION.includes(
    location.pathname,
  );

  if (!isAppReady) {
    return <SplashScreen onFinish={() => setIsAppReady(true)} />;
  }

  return (
    <>
      <main
        className={
          hasBottomNavigation
            ? "min-h-dvh pb-[calc(90px+env(safe-area-inset-bottom))]"
            : "min-h-dvh"
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
          <Route
            path="/mypage/priority-setting"
            element={<PrioritySetting />}
          />
          <Route
            path="/mypage/notification-setting"
            element={<NotificationSetting />}
          />
          <Route path="/home/search" element={<SearchPage />} />
          <Route path="/task-playlist" element={<TaskPlaylistPage />} />
          <Route
            path="/task-recommendations"
            element={<TaskRecommendationsPage />}
          />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {hasBottomNavigation && <BottomNavigation />}
    </>
  );
}

export default App;
