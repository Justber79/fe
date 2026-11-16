import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

const packageRequire = createRequire(import.meta.url);
const { NextRequest } = packageRequire("next/server");

function loadModule(path, dependencies = {}) {
  const source = readFileSync(new URL(`../src/${path}.ts`, import.meta.url), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const module = { exports: {} };
  const require = (id) => dependencies[id] ?? packageRequire(id);
  new Function("require", "module", "exports", output)(require, module, module.exports);
  return module.exports;
}

const constants = loadModule("config/constants");
const helpers = loadModule("utils/helpers", { "@/config/constants": constants });
const { middleware } = loadModule("middleware", {
  "./config/constants": constants,
  "./utils/helpers": helpers,
});

function assertRedirect(path, preference, expectedPath) {
  const origin = "http://localhost:3000";
  const headers = preference ? { cookie: `preferred-lang=${preference}` } : {};
  const response = middleware(new NextRequest(origin + path, { headers }));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), origin + expectedPath);
}

test("signed-out redirects preserve the route language when the saved preference conflicts", () => {
  for (const [language, preference] of [
    ["de", "en"],
    ["en", "de"],
  ]) {
    assertRedirect(`/${language}/dashboard?tab=open`, preference, `/${language}/login`);
    assertRedirect(`/${language}/forms/opportunity?ref=form`, preference, `/${language}/login?ref=form`);
  }
});

test("login redirects without a supported route language still use the existing preference and default", () => {
  assertRedirect("/dashboard", "de", "/login");
  assertRedirect("/fr/dashboard", "de", "/login");
  assertRedirect("/login", "de", "/de/login");
  assertRedirect("/login", undefined, "/en/login");
});
