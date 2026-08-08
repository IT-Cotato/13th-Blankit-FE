import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";

import { BottomNavigation } from "./components/layout/BottomNavigation";
import { CurrentTaskMiniPlayer } from "./components/task-combination/CurrentTaskMiniPlayer";

import { Toast } from "./components/common/Toast";
import { TaskActionLayer } from "./components/task/TaskActionLayer";
import { useTaskManager } from "./hooks/useTaskManager";
import { useToast } from "./hooks/useToast";

import { CalendarPage } from "./pages/calendar/CalendarPage";
import { HomePage } from "./pages/home/HomePage";
import { SearchPage } from "./pages/home/SearchPage";
import { TaskRecommendationsPage } from "./pages/home/TaskRecommendationsPage";
import { CompletedTask } from "./pages/mypage/CompletedTask";
import { EverytimeTimeTableLink } from "./pages/mypage/EverytimeTimeTableLink";
import { MyPage } from "./pages/mypage/MyPage";
import { NotificationSetting } from "./pages/mypage/NotificationSetting";
import { PrioritySetting } from "./pages/mypage/PrioritySetting";
import { TimeTable } from "./pages/mypage/TimeTable";
import { TimeTableCreate } from "./pages/mypage/TimeTableCreate";
import { TimeTableSetting } from "./pages/mypage/TimeTableSetting";
import { TaskPlaylistPage } from "./pages/task-playlist/TaskPlaylistPage";

import { TaskCombinationDetailPage } from "./pages/home/TaskCombinationDetailPage";
import { usePlaylistStore } from "./store/usePlaylistStore";
import { shouldShowCurrentTaskMiniPlayer } from "./utils/currentTaskMiniPlayerRoutes";
import { SplashScreen } from "./components/splash/SplashScreen";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { LoginPage } from "./pages/login/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

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

function App() {
    const location = useLocation();
    const [isAppReady, setIsAppReady] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const currentPlaylistTask = usePlaylistStore((state) => state.playlist[0]);

    const toast = useToast();
    const taskManager = useTaskManager({
        showToast: toast.showToast,
    });

    const pageHasBottomNavigation = !PAGES_WITHOUT_BOTTOM_NAVIGATION.includes(
        location.pathname,
    );

    const hasBottomNavigation =
        !taskManager.isComposerOpen && pageHasBottomNavigation;

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
            ? "min-h-dvh pb-[calc(170px+env(safe-area-inset-bottom))]"
            : hasBottomNavigation
              ? "min-h-dvh pb-[calc(90px+env(safe-area-inset-bottom))]"
              : "min-h-dvh"
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <HomePage
                  refreshKey={taskManager.taskDataVersion}
                  onAddTask={taskManager.openComposer}
                  onTaskClick={taskManager.selectTask}
                />
              ) : (
                <Navigate
                  to="/onboarding"
                  replace
                />
              )
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/calendar"
              element={<CalendarPage />}
            />

            <Route
              path="/mypage"
              element={<MyPage />}
            />

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
              element={<TaskPlaylistPage />}
            />

            <Route
              path="/mypage/priority-setting"
              element={<PrioritySetting />}
            />

            <Route
              path="/mypage/notification-setting"
              element={<NotificationSetting />}
            />

            <Route path="/mypage/timetable" element={<TimeTable />} />
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
            element={<TaskCombinationDetailPage />}
          />

          <Route
            path="/onboarding"
            element={<OnboardingPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />
        </Routes>
      </main>

      {hasBottomNavigation && (
        <BottomNavigation />
      )}

      {hasCurrentTaskMiniPlayer &&
        currentPlaylistTask && (
          <CurrentTaskMiniPlayer
            task={currentPlaylistTask}
          />
        )}

      <TaskActionLayer
        taskFormOptions={
          taskManager.taskFormOptions
        }
        aboveBottomNavigation={
          pageHasBottomNavigation
        }
        isComposerOpen={
          taskManager.isComposerOpen
        }
        editingTask={taskManager.editingTask}
        taskTitle={taskManager.taskTitle}
        taskFormRef={taskManager.taskFormRef}
        onTitleChange={taskManager.setTaskTitle}
        onCloseComposer={
          taskManager.closeComposer
        }
        onCompleteCreate={
          taskManager.completeCreate
        }
        onUpdateTask={taskManager.updateTask}
        actionSheetOpen={
          taskManager.selectedTaskId !== null
        }
        onCloseActionSheet={
          taskManager.closeActionSheet
        }
        onEditTask={
          taskManager.editSelectedTask
        }
        onRequestDelete={
          taskManager.requestDelete
        }
        deleteModalOpen={
          taskManager.taskPendingDelete !== null
        }
        deletingTask={
          taskManager.deletingTask
        }
        onCancelDelete={
          taskManager.cancelDelete
        }
        onConfirmDelete={
          taskManager.confirmDelete
        }
      />

      <Toast
        message={toast.message}
        aboveBottomNavigation={
          pageHasBottomNavigation
        }
      />
    </>
  );
}

export default App;
