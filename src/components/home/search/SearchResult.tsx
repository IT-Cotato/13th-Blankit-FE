import { TaskChip } from "@/components/task/TaskChip";

import type { SearchTaskData } from "@/types/search";

type SearchResultProps = {
  searchResult: SearchTaskData | null;
  isLoading: boolean;
  errorMessage: string | null;
  onTaskClick: (taskId: number) => void;
};

export function SearchResult({
  searchResult,
  isLoading,
  errorMessage,
  onTaskClick,
}: SearchResultProps) {
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[16px] font-medium text-black-100">
          검색 중입니다.
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[16px] font-medium text-red-400">
          {errorMessage}
        </p>
      </div>
    );
  }

  if (!searchResult) {
    return null;
  }

  if (searchResult.totalCount === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[16px] font-medium text-black-100">
          검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <section className="px-5 pt-5">
      <h2 className="mb-4 text-[14px] font-semibold text-black-200">
        검색 결과 ({searchResult.totalCount})
      </h2>

      <ul className="flex flex-col gap-3">
        {searchResult.tasks.map((task) => (
          <li key={task.taskId}>
            <TaskChip
              title={task.title}
              progressRate={task.progressRate}
              priority={task.priority}
              status={task.status}
              categoryColor={task.categoryColor}
              categoryIconKey={task.categoryIconKey}
              onClick={() => onTaskClick(task.taskId)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
