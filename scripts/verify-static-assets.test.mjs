import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { verifyStaticAssets } from "./verify-static-assets.mjs";

const VALID_HEADERS = `/*
  Content-Security-Policy: default-src 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self'
  Strict-Transport-Security: max-age=31536000
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=()

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
`;

async function createFixture() {
  const directory = await mkdtemp(path.join(os.tmpdir(), "pop-craft-assets-"));
  await writeFile(path.join(directory, "index.html"), "<!doctype html>");
  await writeFile(path.join(directory, "404.html"), "not found");
  await writeFile(path.join(directory, "_headers"), VALID_HEADERS);
  return directory;
}

test("有効な静的成果物を受理する", async (t) => {
  const directory = await createFixture();
  t.after(() => rm(directory, { recursive: true, force: true }));

  const result = await verifyStaticAssets(directory);
  assert.equal(result.fileCount, 3);
});

test("必須headerの欠落を拒否する", async (t) => {
  const directory = await createFixture();
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(path.join(directory, "_headers"), "/*\n  X-Frame-Options: DENY\n");

  await assert.rejects(
    verifyStaticAssets(directory),
    /global ruleに必須headerがありません/
  );
});

test("別routeのheaderでglobal ruleの欠落を隠せない", async (t) => {
  const directory = await createFixture();
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(
    path.join(directory, "_headers"),
    VALID_HEADERS.replace("/*", "/admin/*")
  );

  await assert.rejects(
    verifyStaticAssets(directory),
    /global header rule `\/\*` がありません/
  );
});

test("API参照を含むbundleを拒否する", async (t) => {
  const directory = await createFixture();
  t.after(() => rm(directory, { recursive: true, force: true }));
  const chunkDirectory = path.join(directory, "_next", "static");
  await mkdir(chunkDirectory, { recursive: true });
  await writeFile(
    path.join(chunkDirectory, "app.js"),
    'fetch("http://localhost:8080/api/v1/templates")'
  );

  await assert.rejects(
    verifyStaticAssets(directory),
    /公開禁止文字列を検出しました/
  );
});
