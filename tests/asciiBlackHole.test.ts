import assert from "node:assert/strict";
import { test } from "node:test";
import { renderBlackHole } from "../src/components/renderBlackHole.ts";

test("animation keeps a fixed text grid and an empty event horizon", () => {
  for (const time of [0, 0.05, 5, 100]) {
    const frame = renderBlackHole(time);
    const rows = frame.split("\n");
    assert.equal(rows.length, 20);
    assert.ok(rows.every(row => row.length === 50));
    assert.match(frame, /^[\x20-\x7e\n]+$/);
    assert.equal(rows[9].slice(22, 28), "      ");
    assert.ok(frame.trim().length > 0);
  }
});

test("matter changes over time and the initial frame is repeatable", () => {
  assert.notEqual(renderBlackHole(0), renderBlackHole(1));
  assert.equal(renderBlackHole(0), renderBlackHole(0));
});
