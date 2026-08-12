"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ConvexProvider, ConvexReactClient, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";

type Status = Doc<"tasks">["status"];
type Priority = Doc<"tasks">["priority"];

const columns: { id: Status; label: string; accent: string }[] = [
  { id: "backlog", label: "Backlog", accent: "#8490a8" },
  { id: "in_progress", label: "In progress", accent: "#6d5dfc" },
  { id: "review", label: "Review", accent: "#f59e0b" },
  { id: "done", label: "Done", accent: "#17b26a" },
];

const people = ["Maya Chen", "Noah Kim", "Sofia Reyes", "Eli Brooks", "Unassigned"];
const colors = ["#6d5dfc", "#e8518a", "#0ea5e9", "#17b26a", "#f59e0b"];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getIdentity() {
  if (typeof window === "undefined") return { sessionId: "", name: "", color: colors[0] };
  const key = "orbit-board-identity";
  const stored = window.localStorage.getItem(key);
  if (stored) return JSON.parse(stored) as { sessionId: string; name: string; color: string };
  const index = Math.floor(Math.random() * people.length);
  const identity = {
    sessionId: crypto.randomUUID(),
    name: people[index] === "Unassigned" ? "Alex Morgan" : people[index],
    color: colors[index],
  };
  window.localStorage.setItem(key, JSON.stringify(identity));
  return identity;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function BoardApp() {
  if (!convex) {
    return (
      <main className="board-setup">
        <div className="setup-card">
          <div className="brand-mark">O</div>
          <h1>Orbit needs its live workspace</h1>
          <p>Connect the Convex deployment to start collaborating in real time.</p>
        </div>
      </main>
    );
  }
  return (
    <ConvexProvider client={convex}>
      <Board />
    </ConvexProvider>
  );
}

function Board() {
  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);
  const seed = useMutation(api.tasks.seed);
  const heartbeat = useMutation(api.presence.heartbeat);
  const [identity, setIdentity] = useState({ sessionId: "", name: "", color: colors[0] });
  const [clock, setClock] = useState(Date.now());
  const activePeople = useQuery(api.presence.active, { since: clock - 35_000 });
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [modal, setModal] = useState<{ status: Status; task?: Doc<"tasks"> } | null>(null);
  const [dragging, setDragging] = useState<Id<"tasks"> | null>(null);
  const seeded = useRef(false);

  useEffect(() => setIdentity(getIdentity()), []);

  useEffect(() => {
    if (!identity.sessionId) return;
    const ping = () => {
      setClock(Date.now());
      void heartbeat(identity);
    };
    ping();
    const timer = window.setInterval(ping, 15_000);
    return () => window.clearInterval(timer);
  }, [heartbeat, identity]);

  useEffect(() => {
    if (!seeded.current && tasks?.length === 0 && identity.name) {
      seeded.current = true;
      void seed({ actor: identity.name });
    }
  }, [identity.name, seed, tasks]);

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

  async function moveTask(id: Id<"tasks">, status: Status) {
    if (!identity.name) return;
    await updateTask({ id, status, actor: identity.name });
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
          <button className="profile-button" title={identity.name} style={{ background: identity.color }}>
            {initials(identity.name || "You")}
          </button>
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
          actor={identity.name}
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
  actor,
  onClose,
  onCreate,
  onUpdate,
  onRemove,
}: {
  current: { status: Status; task?: Doc<"tasks"> };
  actor: string;
  onClose: () => void;
  onCreate: ReturnType<typeof useMutation<typeof api.tasks.create>>;
  onUpdate: ReturnType<typeof useMutation<typeof api.tasks.update>>;
  onRemove: (id: Id<"tasks">) => Promise<void>;
}) {
  const task = current.task;
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<Status>(task?.status ?? current.status);
  const [taskPriority, setTaskPriority] = useState<Priority>(task?.priority ?? "medium");
  const [assignee, setAssignee] = useState(task?.assignee ?? people[0]);
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
    if (!title.trim() || !actor) return;
    setSaving(true);
    const values = {
      title,
      description,
      status,
      priority: taskPriority,
      assignee,
      dueDate: dueDate || undefined,
      labels: labels.split(","),
      actor,
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
          <label className="field"><span>Assignee</span><select value={assignee} onChange={(event) => setAssignee(event.target.value)}>{people.map((person) => <option key={person}>{person}</option>)}</select></label>
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
