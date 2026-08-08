import type { TaskPriority } from "@/types/task";

export type PriorityFilter = "ALL" | TaskPriority;

type PriorityLevelTabsProps = {
  value: PriorityFilter;
  onChange: (priority: PriorityFilter) => void;
};

const priorityTabs: {
  value: PriorityFilter;
  label: string;
  className: string;
}[] = [
  {
    value: "ALL",
    label: "전체",
    className: "bg-green-500",
  },
  {
    value: "HIGH",
    label: "우선순위 상",
    className: "bg-red-400",
  },
  {
    value: "MEDIUM",
    label: "우선순위 중",
    className: "bg-orange-400",
  },
  {
    value: "LOW",
    label: "우선순위 하",
    className: "bg-lime-400",
  },
];

export function PriorityLevelTabs({
  value,
  onChange,
}: PriorityLevelTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="우선순위 선택"
      className="flex items-center gap-3"
    >
      {priorityTabs.map((tab) => {
        const isSelected = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(tab.value)}
            className={`flex items-center justify-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-semibold leading-[21px] tracking-[-0.21px] outline-none ${
              isSelected
                ? `${tab.className} text-black-900`
                : "bg-black-750/50 text-black-500"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
