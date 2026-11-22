import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

test("3D is an optional enhancement respecting motion, data, and WebGL availability", async () => {
  const file = new URL("../public/assets/badge-policy.mjs", import.meta.url);
  assert.ok(existsSync(file), "Missing badge enhancement policy");
  const { badgePolicy } = await import(file);
  assert.equal(
    badgePolicy({
      reducedMotion: false,
      saveData: false,
      webglAvailable: true,
    }),
    true,
  );
  for (const state of [
    { reducedMotion: true, saveData: false, webglAvailable: true },
    { reducedMotion: false, saveData: true, webglAvailable: true },
    { reducedMotion: false, saveData: false, webglAvailable: false },
  ])
    assert.equal(badgePolicy(state), false);
});
