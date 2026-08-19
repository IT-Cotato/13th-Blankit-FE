export const GRID_SIZE = 5;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE; // 25칸, 칸당 4%

export const computeFilledLevel = (
    actualMinutes: number,
    recommendedMinutes: number,
) => {
    if (recommendedMinutes <= 0) {
        return actualMinutes > 0 ? TOTAL_CELLS : 0;
    }
    const ratio = actualMinutes / recommendedMinutes;
    return Math.min(TOTAL_CELLS, Math.floor(ratio * TOTAL_CELLS));
};
