import { ensureDB } from "./db";
import { getDisplayName } from "./users";

export interface TimeEntryRecord {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  minutes: number;
  entryDate: number;
  note: string | null;
  createdAt: number;
}

type TimeEntryRow = {
  id: string;
  task_id: string;
  user_id: string;
  user_email: string;
  user_first_name: string | null;
  user_last_name: string | null;
  minutes: number;
  entry_date: number;
  note: string | null;
  created_at: number;
};

function toTimeEntryRecord(row: TimeEntryRow): TimeEntryRecord {
  return {
    id: row.id,
    taskId: row.task_id,
    userId: row.user_id,
    userName: getDisplayName({ firstName: row.user_first_name, lastName: row.user_last_name, email: row.user_email }),
    minutes: row.minutes,
    entryDate: row.entry_date,
    note: row.note,
    createdAt: row.created_at,
  };
}

const SELECT_COLUMNS = `
  time_entries.id as id, time_entries.task_id as task_id, time_entries.user_id as user_id,
  time_entries.minutes as minutes, time_entries.entry_date as entry_date,
  time_entries.note as note, time_entries.created_at as created_at,
  users.email as user_email, users.first_name as user_first_name, users.last_name as user_last_name
`;

export async function listTimeEntriesByTask(locals: App.Locals, taskId: string): Promise<TimeEntryRecord[]> {
  const db = ensureDB(locals);
  const { results } = await db
    .prepare(
      `SELECT ${SELECT_COLUMNS}
       FROM time_entries
       INNER JOIN users ON users.id = time_entries.user_id
       WHERE time_entries.task_id = ?
       ORDER BY time_entries.entry_date DESC`
    )
    .bind(taskId)
    .all<TimeEntryRow>();

  return results.map(toTimeEntryRecord);
}

// Every time entry in a project in one query, so the project page's query count doesn't grow with
// its task count (Workers Free caps D1 at 50 queries per invocation). Same order as
// listTimeEntriesByTask.
export async function listTimeEntriesByProject(locals: App.Locals, projectId: string): Promise<TimeEntryRecord[]> {
  const db = ensureDB(locals);
  const { results } = await db
    .prepare(
      `SELECT ${SELECT_COLUMNS}
       FROM time_entries
       INNER JOIN tasks ON tasks.id = time_entries.task_id
       INNER JOIN users ON users.id = time_entries.user_id
       WHERE tasks.project_id = ?
       ORDER BY time_entries.entry_date DESC`
    )
    .bind(projectId)
    .all<TimeEntryRow>();

  return results.map(toTimeEntryRecord);
}

export async function createTimeEntry(
  locals: App.Locals,
  input: { taskId: string; userId: string; minutes: number; entryDate: number; note?: string }
): Promise<string> {
  const db = ensureDB(locals);
  const id = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO time_entries (id, task_id, user_id, minutes, entry_date, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, input.taskId, input.userId, input.minutes, input.entryDate, input.note?.trim() || null, Date.now())
    .run();
  return id;
}

export async function deleteTimeEntry(locals: App.Locals, id: string): Promise<void> {
  const db = ensureDB(locals);
  await db.prepare("DELETE FROM time_entries WHERE id = ?").bind(id).run();
}
