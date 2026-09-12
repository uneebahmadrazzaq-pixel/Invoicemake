"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

type Status = "backlog" | "in_progress" | "review" | "done";
type Priority = "low" | "medium" | "high" | "urgent";
type Task = {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  dueDate?: string;
  labels: string[];
  createdBy: string;
  updatedBy: string;
  updatedAt: number;
};
type Presence = { _id: string; name: string; color: string; lastSeen: number };
type TaskRow = {
  id: string; created_at: string; title: string; description: string; status: Status;
  priority: Priority; assignee: string; due_date: string | null; labels: string[] | null;
  created_by: string; updated_by: string; updated_at: string;
};
type PresenceRow = { user_id: string; name: string; color: string; last_seen: string };
type TaskValues = Omit<Task, "_id" | "_creationTime" | "createdBy" | "updatedBy" | "updatedAt">;

const columns: { id: Status; label: string; accent: string }[] = [
  { id: "backlog", label: "Backlog", accent: "#8490a8" },
  { id: "in_progress", label: "In progress", accent: "#6d5dfc" },
  { id: "review", label: "Review", accent: "#f59e0b" },
  { id: "done", label: "Done", accent: "#17b26a" },
];

const people = ["Maya Chen", "Noah Kim", "Sofia Reyes", "Eli Brooks", "Unassigned"];
const colors = ["#6d5dfc", "#e8518a", "#0ea5e9", "#17b26a", "#f59e0b"];

type SignedInIdentity = {
  name: string;
  color: string;
};

type AuthState =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "signed_in"; user: User; identity: SignedInIdentity }
  | { status: "error"; message: string };

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function colorForSubject(subject: string) {
  const hash = [...subject].reduce((total, character) => total + character.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wwlgzdwkaqmnbopmukjq.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_PPCw6XJgn_ht1LOKQejSdg_v640yyal";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export function BoardApp() {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const syncAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error) return setAuth({ status: "error", message: error.message });
      const user = data.session?.user;
      if (!user) return setAuth({ status: "signed_out" });
      const name = String(user.user_metadata?.full_name || user.email?.split("@")[0] || "Team member");
      setAuth({ status: "signed_in", user, identity: { name, color: colorForSubject(user.id) } });
    };
    void syncAuth();
    const { data: listener } = supabase.auth.onAuthStateChange(() => { void syncAuth(); });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!supabase) {
    return (
      <main className="board-setup">
        <div className="setup-card">
          <div className="brand-mark">O</div>
          <h1>Orbit needs its secure workspace</h1>
          <p>Add the Supabase URL and publishable key to your local environment, then restart the site.</p>
        </div>
      </main>
    );
  }

  if (auth.status === "loading") {
    return <main className="board-setup"><div className="auth-loader" aria-label="Loading secure workspace" /></main>;
  }

  if (auth.status === "error") {
    return <main className="board-setup"><div className="setup-card"><div className="brand-mark">O</div><h1>Sign-in could not start</h1><p>{auth.message}</p></div></main>;
  }

  if (auth.status === "signed_out") {
    return <SupabaseSignIn client={supabase} />;
  }

  return <Board identity={auth.identity} user={auth.user} client={supabase} />;
}

function SupabaseSignIn({ client }: { client: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <main className="board-setup auth-setup">
      <section className="auth-shell">
        <div className="auth-intro"><div className="brand-mark">O</div><span>orbit</span><h1>Welcome to the team workspace</h1><p>Sign in securely to access the shared task board.</p></div>
        <form className="supabase-sign-in" onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          const result = await client.auth.signInWithPassword({ email, password });
          if (result.error) setError(result.error.message);
        }}>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error && <p role="alert">{error}</p>}
          <button className="primary-button" type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}

function SupabaseUserButton({ client, name }: { client: SupabaseClient; name: string }) {
  return <button className="supabase-user-button" title="Sign out" onClick={() => void client.auth.signOut()}>{initials(name)}</button>;
}

function Board({ identity, user, client }: { identity: SignedInIdentity; user: User; client: SupabaseClient }) {
  const [tasks, setTasks] = useState<Task[] | undefined>();
  const [activePeople, setActivePeople] = useState<Presence[]>([]);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [modal, setModal] = useState<{ status: Status; task?: Task } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const seeded = useRef(false);

  useEffect(() => {
    const taskFromRow = (row: TaskRow): Task => ({
      _id: row.id,
      _creationTime: new Date(row.created_at).getTime(),
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      assignee: row.assignee,
      dueDate: row.due_date || undefined,
      labels: row.labels || [],
      createdBy: row.created_by,
      updatedBy: row.updated_by,
      updatedAt: new Date(row.updated_at).getTime(),
    });
    const loadTasks = async () => {
      const { data, error } = await client.from("tasks").select("*").order("updated_at", { ascending: false }).limit(200);
      if (!error) setTasks((data || []).map(taskFromRow));
    };
    const channel = client.channel("board-tasks").on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => void loadTasks()).subscribe();
    void loadTasks();
    return () => { void client.removeChannel(channel); };
  }, [client]);

  useEffect(() => {
    const ping = async () => {
      await client.from("presence").upsert({ user_id: user.id, name: identity.name.slice(0, 40), color: identity.color, last_seen: new Date().toISOString() });
      const since = new Date(Date.now() - 35_000).toISOString();
      const { data } = await client.from("presence").select("*").gte("last_seen", since).order("last_seen", { ascending: false }).limit(20);
      setActivePeople(((data || []) as PresenceRow[]).map((row) => ({ _id: row.user_id, name: row.name, color: row.color, lastSeen: new Date(row.last_seen).getTime() })));
    };
    void ping();
    const timer = window.setInterval(() => void ping(), 15_000);
    return () => window.clearInterval(timer);
  }, [client, identity, user.id]);

  useEffect(() => {
    if (seeded.current || tasks?.length !== 0) return;
    seeded.current = true;
    const now = Date.now();
    const samples = [
      { title: "Map the onboarding journey", description: "Capture the key moments from invite to first completed task.", status: "backlog", priority: "medium", assignee: identity.name, due_date: "2026-08-18", labels: ["Research"] },
      { title: "Build command palette", description: "Add keyboard-first navigation for core board actions.", status: "in_progress", priority: "high", assignee: identity.name, due_date: "2026-08-15", labels: ["Frontend", "Sprint 12"] },
      { title: "Review mobile board gestures", description: "Validate horizontal scrolling and card actions on touch devices.", status: "review", priority: "urgent", assignee: identity.name, due_date: "2026-08-13", labels: ["Mobile"] },
      { title: "Ship notification preferences", description: "Release digest controls and mention alerts.", status: "done", priority: "low", assignee: identity.name, due_date: "2026-08-11", labels: ["Release"] },
      { title: "Refine empty states", description: "Make every first-run state useful and action oriented.", status: "in_progress", priority: "medium", assignee: identity.name, due_date: "2026-08-20", labels: ["Design"] },
    ];
    void client.from("tasks").insert(samples.map((sample, index) => ({ ...sample, created_by: identity.name, updated_by: identity.name, updated_at: new Date(now - index * 1000).toISOString() })));
  }, [client, identity.name, tasks]);

  async function createTask(values: TaskValues) {
    const labels = values.labels.map((label) => label.trim()).filter(Boolean).slice(0, 4);
    const { error } = await client.from("tasks").insert({
      title: values.title.trim(), description: values.description.trim(), status: values.status, priority: values.priority,
      assignee: values.assignee.trim() || "Unassigned", due_date: values.dueDate || null, labels,
      created_by: identity.name, updated_by: identity.name,
    });
    if (error) throw error;
  }

  async function updateTask(values: Omit<Partial<TaskValues>, "dueDate"> & { id: string; dueDate?: string | null }) {
    const patch: Record<string, unknown> = { updated_by: identity.name, updated_at: new Date().toISOString() };
    if (values.title !== undefined) patch.title = values.title.trim();
    if (values.description !== undefined) patch.description = values.description.trim();
    if (values.status !== undefined) patch.status = values.status;
    if (values.priority !== undefined) patch.priority = values.priority;
    if (values.assignee !== undefined) patch.assignee = values.assignee.trim() || "Unassigned";
    if (values.dueDate !== undefined) patch.due_date = values.dueDate || null;
    if (values.labels !== undefined) patch.labels = values.labels.map((label) => label.trim()).filter(Boolean).slice(0, 4);
    const { error } = await client.from("tasks").update(patch).eq("id", values.id);
    if (error) throw error;
  }

  async function removeTask({ id }: { id: string }) {
    const { error } = await client.from("tasks").delete().eq("id", id);
    if (error) throw error;
  }

  const filtered = useMemo(() => {
    if (!tasks) return [];
    const needle = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesText =
        !needle ||
        task.title.toLowerCase().includes(needle) ||
        task.description.toLowerCase().includes(needle) ||
        task.assignee.toLowerCase().includes(needle) ||
        task.labels.some((label) => label.toLowerCase().includes(needle));
      return matchesText && (priority === "all" || task.priority === priority);
    });
  }, [priority, query, tasks]);

  const doneCount = tasks?.filter((task) => task.status === "done").length ?? 0;
  const progress = tasks?.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  async function moveTask(id: string, status: Status) {
    await updateTask({ id, status });
    setDragging(null);
  }

  return (
    <main className="orbit-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">O</div>
          <span>orbit</span>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-avatar">AC</span>
          <span>Acme Product</span>
          <span className="chevron">⌄</span>
        </div>
        <label className="search-box">
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, labels, people…" />
          <kbd>⌘ K</kbd>
        </label>
        <div className="header-actions">
          <div className="presence-stack" aria-label={`${activePeople?.length ?? 0} people online`}>
            {activePeople?.slice(0, 4).map((person) => (
              <span key={person._id} className="avatar" title={`${person.name} is online`} style={{ background: person.color }}>
                {initials(person.name)}
              </span>
            ))}
            <span className="live-dot" title="Live sync active" />
          </div>
          <button className="icon-button" aria-label="Notifications">♢</button>
          <SupabaseUserButton client={client} name={identity.name} />
        </div>
      </header>

      <section className="workspace-head">
        <div>
          <div className="eyebrow"><span>Projects</span><b>/</b><span>Website launch</span></div>
          <h1>Website launch</h1>
          <p>Everything the team needs to ship a remarkable new experience.</p>
        </div>
        <div className="workspace-actions">
          <button className="ghost-button"><span>⋯</span> More</button>
          <button className="primary-button" onClick={() => setModal({ status: "backlog" })}><span>＋</span> New task</button>
        </div>
      </section>

      <section className="toolbar">
        <nav className="view-tabs" aria-label="Board views">
          <button className="active">Board</button>
          <button>List</button>
          <button>Timeline</button>
        </nav>
        <div className="filters">
          <label>
            <span>Priority</span>
            <select value={priority} onChange={(event) => setPriority(event.target.value as Priority | "all")}>
              <option value="all">All priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <span className="task-total">{filtered.length} tasks</span>
        </div>
      </section>

      <section className="board-area">
        <div className="board-grid">
          {columns.map((column) => {
            const columnTasks = filtered.filter((task) => task.status === column.id);
            return (
              <section
                className={`kanban-column ${dragging ? "drag-active" : ""}`}
                key={column.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => dragging && void moveTask(dragging, column.id)}
              >
                <header className="column-head">
                  <div><span className="status-dot" style={{ background: column.accent }} /><h2>{column.label}</h2><span className="count">{columnTasks.length}</span></div>
                  <button aria-label={`Add task to ${column.label}`} onClick={() => setModal({ status: column.id })}>＋</button>
                </header>
                <div className="card-list">
                  {tasks === undefined && <><div className="task-card skeleton" /><div className="task-card skeleton short" /></>}
                  {columnTasks.map((task) => (
                    <article
                      className={`task-card priority-${task.priority}`}
                      draggable
                      key={task._id}
                      onDragStart={() => setDragging(task._id)}
                      onDragEnd={() => setDragging(null)}
                      onClick={() => setModal({ status: task.status, task })}
                    >
                      <div className="card-topline">
                        <span className={`priority-pill ${task.priority}`}>{task.priority}</span>
                        <button className="card-menu" aria-label="Task options" onClick={(event) => event.stopPropagation()}>⋯</button>
                      </div>
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      {task.labels.length > 0 && <div className="labels">{task.labels.map((label) => <span key={label}>{label}</span>)}</div>}
                      <div className="card-footer">
                        <div className="assignee"><span className="mini-avatar">{initials(task.assignee)}</span><span>{task.assignee}</span></div>
                        {task.dueDate && <time dateTime={task.dueDate}>◷ {new Date(`${task.dueDate}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })}</time>}
                      </div>
                    </article>
                  ))}
                  <button className="add-card" onClick={() => setModal({ status: column.id })}>＋ Add task</button>
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <footer className="sync-footer">
        <div><span className="live-dot" /> Live — changes sync instantly</div>
        <div className="progress-wrap"><span>{progress}% complete</span><div className="progress"><i style={{ width: `${progress}%` }} /></div></div>
      </footer>

      {modal && (
        <TaskModal
          current={modal}
          currentUser={identity.name}
          onClose={() => setModal(null)}
          onCreate={createTask}
          onUpdate={updateTask}
          onRemove={async (id) => { await removeTask({ id }); setModal(null); }}
        />
      )}
    </main>
  );
}

function TaskModal({
  current,
  currentUser,
  onClose,
  onCreate,
  onUpdate,
  onRemove,
}: {
  current: { status: Status; task?: Task };
  currentUser: string;
  onClose: () => void;
  onCreate: (values: TaskValues) => Promise<void>;
  onUpdate: (values: Omit<Partial<TaskValues>, "dueDate"> & { id: string; dueDate?: string | null }) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const task = current.task;
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<Status>(task?.status ?? current.status);
  const [taskPriority, setTaskPriority] = useState<Priority>(task?.priority ?? "medium");
  const assignees = [...new Set([currentUser, ...people])];
  const [assignee, setAssignee] = useState(task?.assignee ?? currentUser);
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [labels, setLabels] = useState(task?.labels.join(", ") ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const values = {
      title,
      description,
      status,
      priority: taskPriority,
      assignee,
      dueDate: dueDate || undefined,
      labels: labels.split(","),
    };
    if (task) await onUpdate({ id: task._id, ...values, dueDate: dueDate || null });
    else await onCreate(values);
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="task-modal" onSubmit={submit}>
        <div className="modal-head"><div><span className="modal-kicker">{task ? "Edit task" : "Create a task"}</span><h2>{task ? "Keep the work moving" : "What needs to happen?"}</h2></div><button type="button" onClick={onClose} aria-label="Close">×</button></div>
        <label className="field"><span>Task title</span><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Finalize launch checklist" required /></label>
        <label className="field"><span>Description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add context so the team can move quickly…" rows={4} /></label>
        <div className="field-grid">
          <label className="field"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as Status)}>{columns.map((column) => <option value={column.id} key={column.id}>{column.label}</option>)}</select></label>
          <label className="field"><span>Priority</span><select value={taskPriority} onChange={(event) => setTaskPriority(event.target.value as Priority)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
          <label className="field"><span>Assignee</span><select value={assignee} onChange={(event) => setAssignee(event.target.value)}>{assignees.map((person) => <option key={person}>{person}</option>)}</select></label>
          <label className="field"><span>Due date</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label>
        </div>
        <label className="field"><span>Labels <small>comma separated</small></span><input value={labels} onChange={(event) => setLabels(event.target.value)} placeholder="Design, Launch" /></label>
        <div className="modal-actions">
          {task && <button className="danger-button" type="button" onClick={() => void onRemove(task._id)}>Delete</button>}
          <span />
          <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
          <button className="primary-button" disabled={saving || !title.trim()}>{saving ? "Saving…" : task ? "Save changes" : "Create task"}</button>
        </div>
      </form>
    </div>
  );
}
