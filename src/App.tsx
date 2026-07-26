import {
  useEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { BottomNavigation } from "./components/layout/BottomNavigation";
import {
  TaskCreateComposer,
  type TaskCreateComposerHandle,
} from "./components/task-create/TaskCreateComposer";
import { TaskActionSheet } from "./components/task/TaskActionSheet";
import { TaskDeleteModal } from "./components/task/TaskDeleteModal";

import { CalendarPage } from "./pages/calendar/CalendarPage";
import { HomePage } from "./pages/home/HomePage";
import { SearchPage } from "./pages/home/SearchPage";
import { TaskRecommendationsPage } from "./pages/home/TaskRecommendationsPage";
import { MyPage } from "./pages/mypage/MyPage";
import { TaskPlaylistPage } from "./pages/task-playlist/TaskPlaylistPage";
import { mockTasks } from "./mocks/tasks";
import type { Task } from "./types/task";
import { CompletedTask } from "./pages/mypage/CompletedTask";

const PAGES_WITHOUT_BOTTOM_NAVIGATION = [
  "/mypage/completed-tasks",
  "/task-recommendations",
];

function App() {
  const location = useLocation();
  const taskComposerRef =
    useRef<TaskCreateComposerHandle>(null);
  const toastTimerRef = useRef<number | null>(null);

  const [tasks, setTasks] = useState<Task[]>(() => [...mockTasks]);
  const [selectedTaskId, setSelectedTaskId] =
    useState<number | null>(null);
  const [editingTask, setEditingTask] =
    useState<Task | null>(null);
  const [taskPendingDelete, setTaskPendingDelete] =
    useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [isTaskComposerOpen, setIsTaskComposerOpen] =
    useState(false);
  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  const pageHasBottomNavigation =
    !PAGES_WITHOUT_BOTTOM_NAVIGATION.includes(location.pathname);
  const hasBottomNavigation =
    !isTaskComposerOpen && pageHasBottomNavigation;

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function showToast(message: string) {
    setToastMessage(message);

    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2500);
  }

  function handleOpenTaskComposer() {
    flushSync(() => {
      setEditingTask(null);
      setSelectedTaskId(null);
      setTaskTitle("");
      setIsTaskComposerOpen(true);
    });

    taskComposerRef.current?.focus();
  }

  function handleCloseTaskComposer() {
    setIsTaskComposerOpen(false);
    setEditingTask(null);
    setTaskTitle("");
  }

  function handleTaskCreateComplete() {
    handleCloseTaskComposer();
    showToast("과업이 추가되었습니다.");
  }

  function handleEditTask() {
    const selectedTask = tasks.find(
      (task) => task.taskId === selectedTaskId,
    );
  const hasBottomNavigation =
    !PAGES_WITHOUT_BOTTOM_NAVIGATION.includes(location.pathname);

    if (!selectedTask) {
      return;
    }

    flushSync(() => {
      setSelectedTaskId(null);
      setEditingTask(selectedTask);
      setTaskTitle(selectedTask.title);
      setIsTaskComposerOpen(true);
    });

    taskComposerRef.current?.focus();
  }

  function handleTaskUpdate(updatedTask: Task) {
    setTasks((current) =>
      current.map((task) =>
        task.taskId === updatedTask.taskId ? updatedTask : task,
      ),
    );
    handleCloseTaskComposer();
    showToast("과업이 수정되었습니다.");
  }

  function handleRequestDelete() {
    const selectedTask = tasks.find(
      (task) => task.taskId === selectedTaskId,
    );

    setSelectedTaskId(null);

    if (selectedTask) {
      setTaskPendingDelete(selectedTask);
    }
  }

  function handleConfirmDelete() {
    if (!taskPendingDelete) {
      return;
    }

    setTasks((current) =>
      current.filter(
        (task) => task.taskId !== taskPendingDelete.taskId,
      ),
    );
    setTaskPendingDelete(null);
    showToast("삭제가 완료되었습니다.");
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
              <HomePage
                tasks={tasks}
                onAddTask={handleOpenTaskComposer}
                onTaskClick={setSelectedTaskId}
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
                tasks={tasks}
                onTaskClick={setSelectedTaskId}
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
                tasks={tasks}
                onTaskClick={setSelectedTaskId}
              />
            }
          />
        </Routes>
      </main>

      {hasBottomNavigation && (
        <BottomNavigation />
      )}

      {isTaskComposerOpen && (
        <TaskCreateComposer
          key={editingTask?.taskId ?? "create"}
          ref={taskComposerRef}
          title={taskTitle}
          task={editingTask}
          onTitleChange={setTaskTitle}
          onClose={handleCloseTaskComposer}
          onComplete={handleTaskCreateComplete}
          onUpdate={handleTaskUpdate}
        />
      )}

      <TaskActionSheet
        open={selectedTaskId !== null}
        aboveBottomNavigation={pageHasBottomNavigation}
        onClose={() => setSelectedTaskId(null)}
        onEdit={handleEditTask}
        onDelete={handleRequestDelete}
      />

      <TaskDeleteModal
        open={taskPendingDelete !== null}
        onCancel={() => setTaskPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {toastMessage && (
        <div
          role="status"
          className={`fixed left-1/2 z-[120] -translate-x-1/2 whitespace-nowrap rounded-[8px] border border-black-750 bg-black-850 px-5 py-3 text-[14px] font-medium text-black-100 shadow-lg ${
            pageHasBottomNavigation
              ? "bottom-[calc(104px+env(safe-area-inset-bottom))]"
              : "bottom-4"
          }`}
        >
          {toastMessage}
        </div>
      )}
    </>
  );
}

export default App;
