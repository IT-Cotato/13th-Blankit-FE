import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getTaskPlayerControls } from "./taskPlayerControls.ts";

describe("getTaskPlayerControls", () => {
  it("shows play and check before the current task has started", () => {
    assert.deepEqual(
      getTaskPlayerControls({
        isPlaying: false,
        hasStarted: false,
      }),
      {
        timerControl: "play",
        taskAction: "complete",
      },
    );
  });

  it("shows pause and check while the current task is playing", () => {
    assert.deepEqual(
      getTaskPlayerControls({
        isPlaying: true,
        hasStarted: true,
      }),
      {
        timerControl: "pause",
        taskAction: "complete",
      },
    );
  });

  it("shows play and exit after the current task is paused", () => {
    assert.deepEqual(
      getTaskPlayerControls({
        isPlaying: false,
        hasStarted: true,
      }),
      {
        timerControl: "play",
        taskAction: "exit",
      },
    );
  });
});
