import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { PlaylistTask } from "../types/taskCombination.ts";

import {
  hasCurrentPlaylistTaskChanged,
  selectPlaylistTask,
} from "./playlistSelection.ts";

const playlist = [
  { id: "task-1" },
  { id: "task-2" },
  { id: "task-3" },
] as PlaylistTask[];

describe("selectPlaylistTask", () => {
  it("moves the selected task to the player without starting its timer", () => {
    const result = selectPlaylistTask(playlist, "task-2");

    assert.deepEqual(
      result.map((task) => task.id),
      ["task-2", "task-1", "task-3"],
    );
  });
});

describe("hasCurrentPlaylistTaskChanged", () => {
  it("detects when a different task becomes the current task", () => {
    assert.equal(
      hasCurrentPlaylistTaskChanged(
        playlist,
        playlist.slice(1),
      ),
      true,
    );
  });

  it("keeps the timer when only a later task changes", () => {
    assert.equal(
      hasCurrentPlaylistTaskChanged(
        playlist,
        playlist.slice(0, 2),
      ),
      false,
    );
  });
});
