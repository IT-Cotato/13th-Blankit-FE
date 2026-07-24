import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";

import { BottomNavigation } from "./components/layout/BottomNavigation";

import { CalendarPage } from "./pages/calendar/CalendarPage";
import { HomePage } from "./pages/home/HomePage";
import { SearchPage } from "./pages/home/SearchPage";
import { MyPage } from "./pages/mypage/MyPage";
import { TaskPlaylistPage } from "./pages/task-playlist/TaskPlaylistPage";

import { TaskRecommendationsPage } from "./pages/home/TaskRecommendationsPage";

import { SplashScreen } from "./components/splash/SplashScreen";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { LoginPage } from "./pages/login/LoginPage";

const PAGES_WITHOUT_BOTTOM_NAVIGATION = [
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

    const handleSplashFinish = () => {
        setIsAppReady(true);
    };

    if (!isAppReady) {
        return <SplashScreen onFinish={handleSplashFinish} />;
    }

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

                    <Route path="/calendar" element={<CalendarPage />} />

                    <Route path="/mypage" element={<MyPage />} />

                    <Route path="/home/search" element={<SearchPage />} />

                    <Route
                        path="/task-playlist"
                        element={<TaskPlaylistPage />}
                    />

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
