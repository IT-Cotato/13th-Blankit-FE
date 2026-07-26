import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { BottomNavigation } from "./components/layout/BottomNavigation";
import { Toast } from "./components/common/Toast";
import { TaskActionLayer } from "./components/task/TaskActionLayer";
import { useTaskManager } from "./hooks/useTaskManager";
import { useToast } from "./hooks/useToast";

import { CalendarPage } from "./pages/calendar/CalendarPage";
import { HomePage } from "./pages/home/HomePage";
import { SearchPage } from "./pages/home/SearchPage";
import { TaskRecommendationsPage } from "./pages/home/TaskRecommendationsPage";
import { MyPage } from "./pages/mypage/MyPage";
import { TaskPlaylistPage } from "./pages/task-playlist/TaskPlaylistPage";
import { CompletedTask } from "./pages/mypage/CompletedTask";

const PAGES_WITHOUT_BOTTOM_NAVIGATION = [
  "/mypage/completed-tasks",
  "/task-recommendations",
];

function App() {
  const location = useLocation();
  const toast = useToast();
  const taskManager = useTaskManager({
    showToast: toast.showToast,
  });

  const pageHasBottomNavigation =
    !PAGES_WITHOUT_BOTTOM_NAVIGATION.includes(location.pathname);
  const hasBottomNavigation =
    !taskManager.isComposerOpen && pageHasBottomNavigation;

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
              <HomePage
                tasks={taskManager.tasks}
                onAddTask={taskManager.openComposer}
                onTaskClick={taskManager.selectTask}
              />
            }
          />

          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route
            path="/mypage/completed-tasks"
            element={<CompletedTask />}
          />

          <Route
            path="/mypage"
            element={<MyPage />}
          />

          <Route
            path="/home/search"
            element={
              <SearchPage
                tasks={taskManager.tasks}
                onTaskClick={taskManager.selectTask}
              />
            }
          />

          <Route
            path="/task-playlist"
            element={<TaskPlaylistPage />}
          />

          <Route path="/task-playlist" element={<TaskPlaylistPage />} />
          <Route
            path="/task-recommendations"
            element={
              <TaskRecommendationsPage
                tasks={taskManager.tasks}
                onTaskClick={taskManager.selectTask}
              />
            }
          />
        </Routes>
      </main>

      {hasBottomNavigation && (
        <BottomNavigation />
      )}

      <TaskActionLayer
        aboveBottomNavigation={pageHasBottomNavigation}
        isComposerOpen={taskManager.isComposerOpen}
        editingTask={taskManager.editingTask}
        taskTitle={taskManager.taskTitle}
        composerRef={taskManager.composerRef}
        onTitleChange={taskManager.setTaskTitle}
        onCloseComposer={taskManager.closeComposer}
        onCompleteCreate={taskManager.completeCreate}
        onUpdateTask={taskManager.updateTask}
        actionSheetOpen={taskManager.selectedTaskId !== null}
        onCloseActionSheet={taskManager.closeActionSheet}
        onEditTask={taskManager.editSelectedTask}
        onRequestDelete={taskManager.requestDelete}
        deleteModalOpen={taskManager.taskPendingDelete !== null}
        onCancelDelete={taskManager.cancelDelete}
        onConfirmDelete={taskManager.confirmDelete}
      />

      <Toast
        message={toast.message}
        aboveBottomNavigation={pageHasBottomNavigation}
      />
    </>
  );
}

export default App;
