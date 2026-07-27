import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canCompleteFeedback,
  createDefaultFeedbackSteps,
  createFeedbackDraft,
  getFeedbackCompletionResult,
} from "./taskFeedback.ts";

describe("task feedback draft", () => {
  it("starts disabled even when the task already has progress", () => {
    assert.equal(
      canCompleteFeedback(createFeedbackDraft(40)),
      false,
    );
  });

  it("can be completed with only a memo", () => {
    assert.equal(
      canCompleteFeedback({
        ...createFeedbackDraft(0),
        memo: "2단원까지 정리함",
      }),
      true,
    );
  });

  it("can be completed after progress is adjusted", () => {
    assert.equal(
      canCompleteFeedback({
        ...createFeedbackDraft(0),
        progress: 30,
        progressTouched: true,
      }),
      true,
    );
  });

  it("creates the three default editable steps", () => {
    assert.deepEqual(
      createDefaultFeedbackSteps().map((step) => step.title),
      ["개념 정리", "문제 풀이", "전체 복습하기"],
    );
  });
});

describe("feedback completion result", () => {
  it("advances when another task exists", () => {
    assert.equal(getFeedbackCompletionResult(2), "advanced");
  });

  it("stays on the current task when it is the last one", () => {
    assert.equal(getFeedbackCompletionResult(1), "stayed");
  });
});
