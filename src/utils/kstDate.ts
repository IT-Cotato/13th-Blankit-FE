const KST_OFFSET_MILLISECONDS = 9 * 60 * 60 * 1000;
const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function getKstDateKey(date = new Date()) {
  const kstDate = new Date(
    date.getTime() + KST_OFFSET_MILLISECONDS,
  );

  return [
    kstDate.getUTCFullYear(),
    padDatePart(kstDate.getUTCMonth() + 1),
    padDatePart(kstDate.getUTCDate()),
  ].join("-");
}

export function getMillisecondsUntilNextKstMidnight(
  date = new Date(),
) {
  const elapsedInKstDay =
    (date.getTime() + KST_OFFSET_MILLISECONDS) %
    DAY_MILLISECONDS;

  return DAY_MILLISECONDS - elapsedInKstDay;
}
