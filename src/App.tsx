import { Outlet, Route, Routes } from "react-router-dom";
import { useState } from "react";

import { BottomNavigation } from "./components/layout/BottomNavigation";
import { HomePage } from "./pages/home/HomePage";
import { CalendarPage } from "./pages/calendar/CalendarPage";
import { MyPage } from "./pages/mypage/MyPage";

import { SplashScreen } from "./components/splash/SplashScreen";
import { LoginPage } from "./pages/login/LoginPage";

function MainLayout() {
    return (
        <>
            <main className="min-h-screen pb-[calc(90px+env(safe-area-inset-bottom))]">
                <Outlet />
            </main>

            <BottomNavigation />
        </>
    );
}

function App() {
    const [isAppReady, setIsAppReady] = useState(false);

    const handleSplashFinish = () => {
        setIsAppReady(true);
    };

    if (!isAppReady) {
        return <SplashScreen onFinish={handleSplashFinish} />;
    }

    return (
        <Routes>
            {/* 네비게이션이 보이는 페이지들 */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/mypage" element={<MyPage />} />
            </Route>

            {/* 네비게이션이 없는 페이지들 */}
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
}

export default App;
