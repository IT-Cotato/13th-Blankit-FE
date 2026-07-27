import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";

import { BottomNavigation } from "./components/layout/BottomNavigation";
import { CalendarPage } from "./pages/calendar/CalendarPage";
import { HomePage } from "./pages/home/HomePage";
import { SearchPage } from "./pages/home/SearchPage";
import { TaskRecommendationsPage } from "./pages/home/TaskRecommendationsPage";
import { CompletedTask } from "./pages/mypage/CompletedTask";
import { MyPage } from "./pages/mypage/MyPage";
import { TaskPlaylistPage } from "./pages/task-playlist/TaskPlaylistPage";

import { SplashScreen } from "./components/splash/SplashScreen";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { LoginPage } from "./pages/login/LoginPage";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

const PAGES_WITHOUT_BOTTOM_NAVIGATION = [
    "/mypage/completed-tasks",
    "/task-recommendations",
    "/onboarding",
    "/login",
];

function App() {
    const location = useLocation();
    const [isAppReady, setIsAppReady] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <HomePage />
                            ) : (
                                <Navigate to="/onboarding" replace />
                            )
                        }
                    />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/mypage" element={<MyPage />} />
                        <Route
                            path="/mypage/completed-tasks"
                            element={<CompletedTask />}
                        />
                        <Route path="/home/search" element={<SearchPage />} />
                        <Route
                            path="/task-playlist"
                            element={<TaskPlaylistPage />}
                        />
                        <Route
                            path="/task-recommendations"
                            element={<TaskRecommendationsPage />}
                        />
                    </Route>

                    <Route path="/onboarding" element={<OnboardingPage />} />

                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </main>

            {hasBottomNavigation && <BottomNavigation />}
        </>
    );
}

export default App;
