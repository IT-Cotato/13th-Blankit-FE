import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { ExpiredTaskToast } from "@/components/task/ExpiredTaskToast";
import { useExpiredTasks } from "@/hooks/useExpiredTasks";
import { useDailyRecommendationRefresh } from "@/hooks/useDailyRecommendationRefresh";
import { useDailyElapsedTimeSync } from "@/hooks/useDailyElapsedTimeSync";
import { usePlaylistRefresh } from "@/hooks/usePlaylistRefresh";
import { listenForForegroundMessages } from "@/firebase/messaging";
import { useAuthStore } from "@/store/authStore";
import { useTaskCompletionStore } from "@/store/useTaskCompletionStore";

import { Toast } from "./components/common/Toast";
import { BottomNavigation } from "./components/layout/BottomNavigation";
import { CurrentTaskMiniPlayer } from "./components/task-combination/CurrentTaskMiniPlayer";
import { TaskActionLayer } from "./components/task/TaskActionLayer";

import { useTaskManager } from "./hooks/useTaskManager";
import { useToast } from "./hooks/useToast";

import { CalendarPage } from "./pages/calendar/CalendarPage";
import { HomePage } from "./pages/home/HomePage";
import { SearchPage } from "./pages/home/SearchPage";
import { TaskCombinationDetailPage } from "./pages/home/TaskCombinationDetailPage";
import { TaskRecommendationsPage } from "./pages/home/TaskRecommendationsPage";
import { LoginPage } from "./pages/login/LoginPage";
import { PackNoti } from "./pages/PackNoti";
import { CompletedTask } from "./pages/mypage/CompletedTask";
import { EverytimeTimeTableLink } from "./pages/mypage/EverytimeTimeTableLink";
import { MyPage } from "./pages/mypage/MyPage";
import { NotificationSetting } from "./pages/mypage/NotificationSetting";
import { PrioritySetting } from "./pages/mypage/PrioritySetting";
import { TimeTable } from "./pages/mypage/TimeTable";
import { TimeTableCreate } from "./pages/mypage/TimeTableCreate";
import { TimeTableSetting } from "./pages/mypage/TimeTableSetting";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { TaskPlaylistPage } from "./pages/task-playlist/TaskPlaylistPage";

import { usePlaylistStore } from "./store/usePlaylistStore";

import { shouldShowCurrentTaskMiniPlayer } from "./utils/currentTaskMiniPlayerRoutes";
import { invalidatePlaylistRefresh } from "./utils/playlistRefreshGuard";

const PAGES_WITHOUT_BOTTOM_NAVIGATION = [
    "/mypage/completed-tasks",
    "/mypage/priority-setting",
    "/mypage/notification-setting",
    "/mypage/timetable",
    "/mypage/timetable/new",
    "/mypage/timetable/settings",
    "/mypage/timetable/everytime-link",
    "/task-recommendations",
    "/onboarding",
    "/login",
];

const BASE_MAIN_CLASSNAME = "sm:max-w-app mx-auto min-h-dvh";

function App() {
    const location = useLocation();

    const [isAppReady, setIsAppReady] = useState(false);

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [toastBottom, setToastBottom] = useState<number | null>(null);

    const clearPlaylist = usePlaylistStore((state) => state.clearPlaylist);

    const completedTaskId = useTaskCompletionStore(
        (state) => state.completedTaskId,
    );

    const { message: toastMessage, showToast } = useToast();
    useEffect(() => {
        let unsubscribe: () => void = () => undefined;
        let cancelled = false;

        void listenForForegroundMessages(async (payload) => {
            if (Notification.permission !== "granted") return;

            const registration = await navigator.serviceWorker.ready;
            const title =
                payload.notification?.title ?? payload.data?.title ?? "Blankit";

            await registration.showNotification(title, {
                body: payload.notification?.body ?? payload.data?.body ?? "",
                icon: "/icon/192x192.png",
                badge: "/icon/192x192.png",
                data: {
                    url: payload.data?.url ?? "/",
                },
            });
        }).then((stopListening) => {
            if (cancelled) {
                stopListening();
                return;
            }

            unsubscribe = stopListening;
        });

        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, []);

    const authenticatedUserId = useAuthStore(
        (state) => state.user?.userId ?? null,
    );

    const dailyRecommendationRefreshKey = useDailyRecommendationRefresh(
        isAppReady && isAuthenticated,
    );

    useDailyElapsedTimeSync(isAppReady && isAuthenticated);

    const currentPlaylistTask = usePlaylistStore((state) => state.playlist[0]);

    const taskManager = useTaskManager({
        showToast,
    });

    const { currentExpiredTask, extendCurrentTaskDeadline } = useExpiredTasks({
        enabled:
            isAppReady &&
            isAuthenticated &&
            authenticatedUserId !== null &&
            location.pathname === "/" &&
            completedTaskId === null &&
            !taskManager.isComposerOpen,
        refreshKey: taskManager.taskDataVersion,
        onOpenTaskEdit: taskManager.openTaskForEdit,
        onTaskDeleted: taskManager.notifyTaskChanged,
        onShowToast: showToast,
    });

    const { refreshPlaylist } = usePlaylistRefresh();

    const pageHasBottomNavigation = !PAGES_WITHOUT_BOTTOM_NAVIGATION.includes(
        location.pathname,
    );

    const hasBottomNavigation =
        !taskManager.isComposerOpen && pageHasBottomNavigation;

    const hasCurrentTaskMiniPlayer =
        Boolean(currentPlaylistTask) &&
        shouldShowCurrentTaskMiniPlayer(location.pathname) &&
        !PAGES_WITHOUT_BOTTOM_NAVIGATION.includes(location.pathname);

    useEffect(() => {
        if (!isAppReady) {
            return;
        }

        if (!isAuthenticated || authenticatedUserId === null) {
            invalidatePlaylistRefresh();
            clearPlaylist();
            return;
        }

        refreshPlaylist().catch((error) => {
            console.error(error);

            showToast("과업 플레이리스트 조회에 실패했습니다.");
        });
    }, [
        isAppReady,
        isAuthenticated,
        authenticatedUserId,
        clearPlaylist,
        refreshPlaylist,
        showToast,
    ]);

    const handleSplashFinish = () => {
        setIsAppReady(true);
    };

    const mainClassName = hasCurrentTaskMiniPlayer
        ? `${BASE_MAIN_CLASSNAME} pb-[calc(170px+env(safe-area-inset-bottom))]`
        : hasBottomNavigation
          ? `${BASE_MAIN_CLASSNAME} pb-[calc(90px+env(safe-area-inset-bottom))]`
          : BASE_MAIN_CLASSNAME;

    if (!isAppReady) {
        return <SplashScreen onFinish={handleSplashFinish} />;
    }

    return (
        <>
            <main className={mainClassName}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <HomePage
                                    refreshKey={taskManager.taskDataVersion}
                                    dailyRecommendationRefreshKey={
                                        dailyRecommendationRefreshKey
                                    }
                                    onAddTask={taskManager.openComposer}
                                    onTaskClick={taskManager.selectTask}
                                />
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

                        <Route
                            path="/home/search"
                            element={
                                <SearchPage
                                    onTaskClick={taskManager.selectTask}
                                />
                            }
                        />

                        <Route
                            path="/task-playlist"
                            element={
                                <TaskPlaylistPage
                                    dailyRecommendationRefreshKey={
                                        dailyRecommendationRefreshKey
                                    }
                                />
                            }
                        />

                        <Route path="/pack-noti" element={<PackNoti />} />

                        <Route
                            path="/mypage/priority-setting"
                            element={<PrioritySetting />}
                        />

                        <Route
                            path="/mypage/notification-setting"
                            element={<NotificationSetting />}
                        />

                        <Route
                            path="/mypage/timetable"
                            element={<TimeTable />}
                        />

                        <Route
                            path="/mypage/timetable/new"
                            element={<TimeTableCreate />}
                        />

                        <Route
                            path="/mypage/timetable/settings"
                            element={<TimeTableSetting />}
                        />

                        <Route
                            path="/mypage/timetable/everytime-link"
                            element={<EverytimeTimeTableLink />}
                        />

                        <Route
                            path="/task-recommendations"
                            element={
                                <TaskRecommendationsPage
                                    refreshKey={taskManager.taskDataVersion}
                                    onTaskClick={taskManager.selectTask}
                                />
                            }
                        />
                    </Route>

                    <Route
                        path="/task-combinations/:modeId"
                        element={
                            <TaskCombinationDetailPage
                                dailyRecommendationRefreshKey={
                                    dailyRecommendationRefreshKey
                                }
                            />
                        }
                    />

                    <Route path="/onboarding" element={<OnboardingPage />} />

                    <Route
                        path="/login"
                        element={
                            <LoginPage
                                onShowToast={showToast}
                                onSetToastBottom={setToastBottom}
                            />
                        }
                    />
                </Routes>
            </main>

            {hasBottomNavigation && <BottomNavigation />}

            {hasCurrentTaskMiniPlayer && currentPlaylistTask && (
                <CurrentTaskMiniPlayer
                    task={currentPlaylistTask}
                    onShowToast={showToast}
                    dailyRecommendationRefreshKey={
                        dailyRecommendationRefreshKey
                    }
                />
            )}

            <TaskActionLayer
                taskFormOptions={taskManager.taskFormOptions}
                aboveBottomNavigation={pageHasBottomNavigation}
                isComposerOpen={taskManager.isComposerOpen}
                editingTask={taskManager.editingTask}
                taskTitle={taskManager.taskTitle}
                taskFormRef={taskManager.taskFormRef}
                onTitleChange={taskManager.setTaskTitle}
                onCloseComposer={taskManager.closeComposer}
                onCompleteCreate={taskManager.completeCreate}
                onUpdateTask={taskManager.updateTask}
                actionSheetOpen={taskManager.selectedTaskId !== null}
                editingTaskReady={taskManager.editingTaskReady}
                onCloseActionSheet={taskManager.closeActionSheet}
                onEditTask={taskManager.editSelectedTask}
                onRequestDelete={taskManager.requestDelete}
                deleteModalOpen={taskManager.taskPendingDelete !== null}
                deletingTask={taskManager.deletingTask}
                onCancelDelete={taskManager.cancelDelete}
                onConfirmDelete={taskManager.confirmDelete}
                addingToPlaylist={taskManager.addingToPlaylist}
                onAddToPlaylist={taskManager.addSelectedTaskToPlaylist}
            />

            {currentExpiredTask && (
                <ExpiredTaskToast
                    taskTitle={currentExpiredTask.title}
                    onExtendDeadline={extendCurrentTaskDeadline}
                />
            )}

            <Toast
                message={toastMessage}
                variant={location.pathname === "/login" ? "login" : "default"}
                aboveBottomNavigation={pageHasBottomNavigation}
                bottom={toastBottom}
            />
        </>
    );
}

export default App;
