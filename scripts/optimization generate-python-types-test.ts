#!/usr/bin/env node
"use strict";

/**
 * Generate Python types for CI validation.
 * Calls the local Fastify app and prints the generated types to stdout.
 */

import { build } from "../src/server/app.js";

const TEST_CONNECTION_STRING =
  process.env.TEST_DB_URL ||
  "postgresql://postgres:postgres@localhost:5432";

const REQUEST_TIMEOUT_MS = 20000;

// ---- Helpers ----

function fail(message, extra) {
  console.error(`❌ ${message}`);
  if (extra) console.error(extra);
  process.exit(1);
}

function setupGlobalErrorHandlers() {
  process.on("unhandledRejection", (err) => {
    fail("Unhandled promise rejection", err);
  });

  process.on("uncaughtException", (err) => {
    fail("Uncaught exception", err);
  });

  process.on("SIGINT", () => process.exit(1));
  process.on("SIGTERM", () => process.exit(1));
}

async function injectWithTimeout(app) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), REQUEST_TIMEOUT_MS)
  );

  const request = app.inject({
    method: "GET",
    url: "/generators/python",
    headers: { pg: TEST_CONNECTION_STRING },
    query: { access_control: "public" },
  });

  return Promise.race([request, timeout]);
}

// ---- Main ----

async function generatePythonTypes() {
  setupGlobalErrorHandlers();

  let app;

  try {
    app = build();
  } catch (err) {
    fail("Failed to build Fastify app", err);
  }

  try {
    const response = await injectWithTimeout(app);

    if (!response) {
      fail("No response received from generator endpoint");
    }

    if (response.statusCode !== 200) {
      fail(`Generator failed with status ${response.statusCode}`, response.body);
    }

    if (!response.body || response.body.trim().length === 0) {
      fail("Generator returned empty output");
    }

    // Success → print to stdout for CI capture
    process.stdout.write(response.body);
    process.exit(0);
  } catch (err) {
    fail("Error generating Python types", err);
  } finally {
    try {
      if (app) await app.close();
    } catch {
      // ignore shutdown errors
    }
  }
}

generatePythonTypes();
