import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getActiveTaskSession,
  startTaskSession,
  updateTaskSessionStatus,
} from "@/api/taskSessions";

import type {
  TaskSessionResponse,
  TaskSessionStatus,
} from "@/types/taskSession";

const sessionRequests = new Map<
  number,
  Promise<TaskSessionResponse>
>();

function getOrStartTaskSession(taskId: number) {
  const pendingRequest = sessionRequests.get(taskId);

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = (async () => {
    const activeSession =
      await getActiveTaskSession(taskId);

    if (activeSession) {
      return activeSession;
    }

    return startTaskSession(taskId);
  })();

  sessionRequests.set(taskId, request);

  const clearRequest = () => {
    if (sessionRequests.get(taskId) === request) {
      sessionRequests.delete(taskId);
    }
  };

  void request.then(clearRequest, clearRequest);

  return request;
}

export function useTaskSession(
  taskId: number | null,
) {
  const [session, setSession] =
    useState<TaskSessionResponse | null>(null);
  const [isLoadingSession, setIsLoadingSession] =
    useState(false);
  const [isUpdatingSession, setIsUpdatingSession] =
    useState(false);
  const [sessionError, setSessionError] = useState<
    string | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const statusUpdateInFlightRef = useRef(false);

  useEffect(() => {
    if (taskId === null) {
      return;
    }

    let cancelled = false;

    const prepareSession = async () => {
      setIsLoadingSession(true);
      setSessionError(null);

      try {
        const nextSession =
          await getOrStartTaskSession(taskId);

        if (!cancelled) {
          setSession(nextSession);
        }
      } catch {
        if (!cancelled) {
          setSession(null);
          setSessionError(
            "과업 세션을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSession(false);
        }
      }
    };

    void prepareSession();

    return () => {
      cancelled = true;
    };
  }, [refreshKey, taskId]);

  const changeSessionStatus = useCallback(
    async (
      status: TaskSessionStatus,
      elapsedTime: number,
    ) => {
      if (
        statusUpdateInFlightRef.current ||
        !session ||
        session.taskId !== taskId
      ) {
        return null;
      }

      statusUpdateInFlightRef.current = true;
      setIsUpdatingSession(true);
      setSessionError(null);

      try {
        const updatedSession =
          await updateTaskSessionStatus(
            session.taskSessionId,
            {
              status,
              elapsedTime: Math.max(
                0,
                Math.floor(elapsedTime),
              ),
            },
          );

        setSession((currentSession) =>
          currentSession?.taskSessionId ===
          updatedSession.taskSessionId
            ? updatedSession
            : currentSession,
        );

        return updatedSession;
      } catch (error) {
        setSessionError(
          "과업 세션 상태를 저장하지 못했습니다.",
        );
        throw error;
      } finally {
        statusUpdateInFlightRef.current = false;
        setIsUpdatingSession(false);
      }
    },
    [session, taskId],
  );

  const retrySession = useCallback(() => {
    setSession(null);
    setRefreshKey((current) => current + 1);
  }, []);

  const clearSessionError = useCallback(() => {
    setSessionError(null);
  }, []);

  const currentSession =
    session?.taskId === taskId ? session : null;

  return {
    session: currentSession,
    isLoadingSession:
      taskId !== null && isLoadingSession,
    isUpdatingSession,
    sessionError:
      taskId !== null ? sessionError : null,
    changeSessionStatus,
    retrySession,
    clearSessionError,
  };
}