import { useNavigate } from "react-router-dom";

import { MyPageDetailTopBar } from "@/components/mypage/MyPageDetailTopBar";
import { TimeTableDataSetting } from "@/components/mypage/timetable/TimeTableDataSetting";
import { TimeTableTimeSetting } from "@/components/mypage/timetable/TimeTableTimeSetting";
import { useTimeTableStore } from "@/store/useTimeTableStore";
import { resetTimetable } from "@/api/mypage/timetable";

export function TimeTableSetting() {
  const navigate = useNavigate();
  const resetTimeTable = useTimeTableStore((state) => state.resetTimeTable);

  const handleReset = async () => {
    try {
      await resetTimetable();
    } catch (error) {
      console.error("시간표 초기화 API 호출에 실패했습니다.", error);
    }
    resetTimeTable();
    navigate("/mypage/timetable", { replace: true });
  };

  return (
    <div className="min-h-dvh bg-black-900 text-black-100">
      <MyPageDetailTopBar
        title="설정"
        onBack={() => navigate("/mypage/timetable")}
      />

      <main className="px-5 pt-5">
        <TimeTableTimeSetting />
        <div className="mt-6">
          <TimeTableDataSetting onReset={handleReset} />
        </div>
      </main>
    </div>
  );
}
