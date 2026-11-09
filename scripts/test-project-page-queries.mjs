import assert from "node:assert/strict";
import { runtime, ids } from "./test-runtime.mjs";

// Issue #39: the admin project page loads task notes and time entries with one project-wide query
// each (D1 allows 50 queries per invocation on Workers Free), then groups the rows by task.
const app = await runtime();
const id = (number) => `00000000-0000-4000-8000-${String(number).padStart(12, "0")}`;
const project = id(100), other = id(101), otherTask = id(102), emptyTask = id(103);
const count = 24;
const tasks = Array.from({ length: count }, (_, i) => id(200 + i));
const label = (i) => String(i).padStart(2, "0");
const minutes = (i) => 30 + i * 15; // task 04 logs 90 minutes
const extra = 45; // a second entry on task 00, so its total is a sum
const formatMinutes = (m) => `${Math.floor(m / 60)}h ${m % 60}m`;
try {
  const taskRows = tasks.map((task, i) => `('${task}','${project}','Task ${label(i)}','task','planning','normal',${i},${i})`);
  taskRows.push(`('${emptyTask}','${project}','Empty task','task','planning','normal',99,99)`,
    `('${otherTask}','${other}','Other task','task','planning','normal',0,0)`);
  app.sql(`INSERT INTO projects(id,client_id,name,status,created_at,updated_at) VALUES
    ('${project}','${ids.client}','Synthetic project','planning',0,0), ('${other}',NULL,'Internal project','planning',0,0);
    INSERT INTO tasks(id,project_id,title,type,lane,priority,created_at,updated_at) VALUES ${taskRows.join(",")};`);
  // Rows are inserted in reverse task order so grouping can't lean on insertion order.
  const notes = tasks.map((task, i) => `('${id(300 + i)}','${task}','${ids.admin}','note-${label(i)}-body',${1000 + i},${1000 + i})`).reverse();
  notes.push(`('${id(399)}','${otherTask}','${ids.admin}','note-other-project',0,0)`);
  const entries = tasks.map((task, i) => `('${id(400 + i)}','${task}','${ids.admin}',${minutes(i)},${86400000 * (i + 1)},'entry-${label(i)}-note',0)`).reverse();
  entries.push(`('${id(498)}','${tasks[0]}','${ids.admin}',${extra},0,'entry-00-second',0)`,
    `('${id(499)}','${otherTask}','${ids.admin}',5,0,'entry-other-project',0)`);
  app.sql(`INSERT INTO task_notes(id,task_id,author_user_id,body,created_at,updated_at) VALUES ${notes.join(",")};
    INSERT INTO time_entries(id,task_id,user_id,minutes,entry_date,note,created_at) VALUES ${entries.join(",")};`);

  const cookie = (await app.login("admin@example.test")).headers.get("set-cookie").split(";")[0];
  const response = await fetch(`${app.origin}/admin/projects/${project}`, { headers: { cookie }, redirect: "manual" });
  const html = await response.text();
  assert.equal(response.status, 200, `${html.slice(0, 500)}\n${app.output().slice(-7000)}`);
  const panel = (task) => {
    const match = html.match(new RegExp(`<template id="task-panel-${task}">([\\s\\S]*?)</template>`));
    assert.ok(match, `panel for ${task}`);
    return match[1];
  };
  assert.equal(html.match(/<template id="task-panel-/g).length, count + 1);
  tasks.forEach((task, i) => {
    const body = panel(task);
    assert.ok(body.includes(`>note-${label(i)}-body<`), `task ${label(i)} note`);
    assert.ok(body.includes(`>entry-${label(i)}-note<`), `task ${label(i)} entry`);
    assert.ok(body.includes(`<td>${formatMinutes(minutes(i))}</td>`), `task ${label(i)} entry amount`);
    const total = minutes(i) + (i === 0 ? extra : 0);
    assert.ok(body.includes(`Total: <strong>${formatMinutes(total)}</strong>`), `task ${label(i)} total`);
    for (const j of tasks.keys()) {
      if (j === i) continue;
      assert.ok(!body.includes(`note-${label(j)}-body`), `task ${label(i)} holds task ${label(j)}'s note`);
      assert.ok(!body.includes(`entry-${label(j)}-note`), `task ${label(i)} holds task ${label(j)}'s entry`);
    }
    assert.equal(body.includes("entry-00-second"), i === 0, `task ${label(i)} second entry`);
  });
  assert.ok(panel(tasks[4]).includes("Total: <strong>1h 30m</strong>"), "90 minutes shows as 1h 30m");
  assert.ok(panel(tasks[0]).includes(`Total: <strong>${formatMinutes(minutes(0) + extra)}</strong>`), "entries are summed");
  const empty = panel(emptyTask);
  assert.ok(empty.includes("No notes yet.") && empty.includes("No time logged yet."), "empty task");
  assert.ok(empty.includes("Total: <strong>0h 0m</strong>"), "empty task total");
  assert.ok(!html.includes("note-other-project") && !html.includes("entry-other-project"), "other project's rows stay out");
  console.log(`PASS: ${count + 1} task panels, each with only its own notes, time entries and total`);
} finally { app.close(); }
