#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const FREE_FILE_LIMIT = 20_000;
export const FILE_SIZE_LIMIT = 25 * 1024 * 1024;

const REQUIRED_FILES = ["index.html", "404.html", "_headers"];
const REQUIRED_HEADERS = [
  "Content-Security-Policy:",
  "Strict-Transport-Security:",
  "X-Content-Type-Options: nosniff",
  "X-Frame-Options: DENY",
  "Referrer-Policy:",
  "Permissions-Policy:",
];
const REQUIRED_CSP_DIRECTIVES = [
  "default-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self'",
];
const FORBIDDEN_TEXT = [
  "NEXT_PUBLIC_API_URL",
  "localhost:8080",
  "/api/v1/",
  "CLOUDFLARE_API_TOKEN",
  "CLOUDFLARE_ACCOUNT_ID",
  "CF_API_TOKEN",
];
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".svg",
  ".txt",
  ".webmanifest",
  ".xml",
]);

async function collectFiles(directory, rootDirectory = directory) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(
        `静的成果物にシンボリックリンクは含められません: ${path.relative(rootDirectory, absolutePath)}`
      );
    }
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath, rootDirectory)));
    } else if (entry.isFile()) {
      const fileStat = await stat(absolutePath);
      files.push({
        absolutePath,
        relativePath: path.relative(rootDirectory, absolutePath),
        size: fileStat.size,
      });
    }
  }

  return files;
}

function isTextFile(relativePath) {
  return (
    path.basename(relativePath) === "_headers" ||
    TEXT_EXTENSIONS.has(path.extname(relativePath))
  );
}

export async function verifyStaticAssets(outputDirectory) {
  const files = await collectFiles(outputDirectory);
  const relativePaths = new Set(files.map((file) => file.relativePath));
  const errors = [];

  for (const requiredFile of REQUIRED_FILES) {
    if (!relativePaths.has(requiredFile)) {
      errors.push(`必須ファイルがありません: ${requiredFile}`);
    }
  }

  if (files.length > FREE_FILE_LIMIT) {
    errors.push(
      `Free上限を超えています: ${files.length} files > ${FREE_FILE_LIMIT} files`
    );
  }

  for (const file of files) {
    if (file.size > FILE_SIZE_LIMIT) {
      errors.push(
        `Free上限を超えるファイルです: ${file.relativePath} (${file.size} bytes)`
      );
    }

    if (!isTextFile(file.relativePath)) continue;
    const content = await readFile(file.absolutePath, "utf8");
    for (const forbiddenText of FORBIDDEN_TEXT) {
      if (content.includes(forbiddenText)) {
        errors.push(
          `公開禁止文字列を検出しました: ${file.relativePath}: ${forbiddenText}`
        );
      }
    }
  }

  if (relativePaths.has("_headers")) {
    const headers = await readFile(path.join(outputDirectory, "_headers"), "utf8");
    for (const requiredHeader of REQUIRED_HEADERS) {
      if (!headers.includes(requiredHeader)) {
        errors.push(`必須セキュリティヘッダーがありません: ${requiredHeader}`);
      }
    }
    for (const directive of REQUIRED_CSP_DIRECTIVES) {
      if (!headers.includes(directive)) {
        errors.push(`必須CSP directiveがありません: ${directive}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  const largestFile = files.reduce(
    (largest, file) => (file.size > largest.size ? file : largest),
    { relativePath: "-", size: 0 }
  );

  return {
    fileCount: files.length,
    largestFile: largestFile.relativePath,
    largestFileSize: largestFile.size,
  };
}

async function main() {
  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
  const repositoryRoot = path.resolve(scriptDirectory, "..");
  const outputDirectory = path.resolve(
    repositoryRoot,
    process.argv[2] ?? "frontend/out"
  );
  const result = await verifyStaticAssets(outputDirectory);
  console.log(
    `Static Assets検証成功: ${result.fileCount}/${FREE_FILE_LIMIT} files, 最大 ${result.largestFileSize}/${FILE_SIZE_LIMIT} bytes (${result.largestFile})`
  );
}

const isDirectExecution =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
