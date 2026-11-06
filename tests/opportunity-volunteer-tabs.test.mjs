import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { OpportunityVolunteerStatusType as Status, UserRole } from "need4deed-sdk";

const packageRequire = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.resolve(__dirname, "..");
const hookPath = "src/components/Dashboard/Profile/sections/shared/useTabTransitions.ts";
const orderPath =
  "src/components/Dashboard/Profile/sections/OpportunityVolunteers/get-opportunity-volunteer-status-order.ts";

function loadModule(file, dependencies) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (id) => dependencies[id] ?? packageRequire(id);
  new Function("require", "module", "exports", output)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

function createHarness() {
  const states = [];
  let cursor = 0;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in states)) states[index] = typeof initial === "function" ? initial() : initial;
      return [
        states[index],
        (next) => {
          states[index] = typeof next === "function" ? next(states[index]) : next;
        },
      ];
    },
    useEffect() {},
  };
  const hook = loadModule(hookPath, { react });
  const order = loadModule(orderPath, { "../shared/useTabTransitions": hook });
  return {
    ...order,
    ...hook,
    render(items, statuses) {
      cursor = 0;
      return hook.useTabTransitions(items, statuses);
    },
  };
}

const items = [Status.PENDING, Status.MATCHED, Status.ACTIVE, Status.PAST, Status.ACTIVE, Status.PENDING].map(
  (status, id) => ({ id, status }),
);

for (const role of [UserRole.AGENT, UserRole.COORDINATOR, UserRole.ADMIN]) {
  test(`${role}: role-specific tabs keep counts aligned`, () => {
    const h = createHarness();
    const isStaff = role === UserRole.COORDINATOR || role === UserRole.ADMIN;
    const order = h.getOpportunityVolunteerStatusOrder(isStaff, true);
    assert.deepEqual(order, isStaff ? h.TAB_STATUS_ORDER : [Status.MATCHED, Status.ACTIVE, Status.PAST]);
    assert.deepEqual(h.render(items, order).tabCounts, isStaff ? [2, 1, 2, 1] : [1, 2, 1]);
    order.forEach((status, index) => {
      h.render(items, order).setSelectedTabIndex(index);
      const result = h.render(items, order);
      assert.equal(result.currentTabStatus, status);
      assert.ok(result.visibleItems.every((item) => item.status === status));
      assert.equal(result.visibleItems.length, result.tabCounts[index]);
    });
  });
}

test("unresolved role exposes no tabs or volunteers", () => {
  const h = createHarness();
  const order = h.getOpportunityVolunteerStatusOrder(false, false);
  assert.deepEqual(order, []);
  assert.deepEqual(h.render(items, order).visibleItems, []);
});

for (const selected of [Status.ACTIVE, Status.PAST]) {
  test(`${selected} remains selected when Pending disappears`, () => {
    const h = createHarness();
    h.render(items, h.TAB_STATUS_ORDER).setSelectedTabIndex(h.TAB_STATUS_ORDER.indexOf(selected));
    const order = h.getOpportunityVolunteerStatusOrder(false, true);
    const result = h.render(items, order);
    assert.equal(result.currentTabStatus, selected);
    assert.equal(result.selectedTabIndex, order.indexOf(selected));
    assert.ok(result.visibleItems.length > 0);
  });
}

test("removed selection falls back to the first visible status", () => {
  const h = createHarness();
  h.render(items, h.TAB_STATUS_ORDER).setSelectedTabIndex(0);
  const result = h.render(items, h.getOpportunityVolunteerStatusOrder(false, true));
  assert.equal(result.currentTabStatus, Status.MATCHED);
  assert.equal(result.selectedTabIndex, 0);
});

test("optimistic transitions retain aligned counts", () => {
  const h = createHarness();
  h.render(items).setItemStatus(0, Status.ACTIVE);
  const result = h.render(items);
  assert.deepEqual(result.tabCounts, [1, 1, 3, 1]);
});
