export interface PendingStepTitleSave {
  stepId: string;
  title: string;
}

export type StepTitleSaveQueue = Map<
  string,
  PendingStepTitleSave
>;

export function queueStepTitleSave(
  pendingSaves: StepTitleSaveQueue,
  stepId: string,
  title: string,
) {
  pendingSaves.set(stepId, { stepId, title });
}

export function takeNextStepTitleSave(
  pendingSaves: StepTitleSaveQueue,
) {
  const nextSave = pendingSaves.values().next().value;

  if (!nextSave) {
    return null;
  }

  pendingSaves.delete(nextSave.stepId);
  return nextSave;
}
