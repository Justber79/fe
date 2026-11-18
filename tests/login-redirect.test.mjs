import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";
import { UserRole } from "need4deed-sdk";

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

function assertRedirect(path, preference, expectedPath, token) {
  const origin = "http://localhost:3000";
  const cookies = [preference && `preferred-lang=${preference}`, token && `refresh=${token}`].filter(Boolean);
  const headers = { cookie: cookies.join("; ") };
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
  assertRedirect("/fr/login?ref=test", "de", "/de/login?ref=test");
  assertRedirect("/DE/login", undefined, "/en/login");
});

test("role redirects retain the route language and query through the destination", () => {
  const cases = [
    [UserRole.AGENT, "/dashboard/admin", "/dashboard"],
    [UserRole.VOLUNTEER, "/dashboard/posts", "/dashboard"],
    [UserRole.USER, "/dashboard/agents/42", "/dashboard/agents"],
    [UserRole.AGENT, "/dashboard/calendar", "/dashboard"],
  ];
  const origin = "http://localhost:3000";
  for (const [language, preference] of [
    ["de", "en"],
    ["en", "de"],
  ]) {
    for (const [role, from, to] of cases) {
      const token = `header.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.signature`;
      const destination = `/${language}${to}?ref=test`;
      assertRedirect(`/${language}${from}?ref=test`, preference, destination, token);
      const response = middleware(
        new NextRequest(origin + destination, {
          headers: { cookie: `preferred-lang=${preference}; refresh=${token}` },
        }),
      );
      assert.equal(response.status, 200);
      assert.equal(response.cookies.get("preferred-lang")?.value, language);
    }
  }
});

test("login paths for client redirects use only supported URL languages", () => {
  assert.equal(helpers.getLoginPath("/de/persons"), "/de/login");
  assert.equal(helpers.getLoginPath("/en/persons"), "/en/login");
  assert.equal(helpers.getLoginPath("/fr/persons"), "/login");
  assert.equal(helpers.getLoginPath("/persons"), "/login");
});
