"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clerk } from "@clerk/clerk-js";
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

type SignedInIdentity = {
  name: string;
  color: string;
};

type AuthState =
  | { status: "loading" }
  | { status: "signed_out"; clerk: Clerk }
  | { status: "signed_in"; clerk: Clerk; identity: SignedInIdentity }
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

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function BoardApp() {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    if (!convex || !clerkPublishableKey) return;
    let active = true;
    let unsubscribe: (() => void) | undefined;
    const clerk = new Clerk(clerkPublishableKey);

    void clerk
      .load({ signInFallbackRedirectUrl: window.location.href, signUpFallbackRedirectUrl: window.location.href })
      .then(() => {
        const syncAuth = () => {
          if (!active) return;
          if (!clerk.session || !clerk.user) {
            convex.clearAuth();
            setAuth({ status: "signed_out", clerk });
            return;
          }
          convex.setAuth(async () => {
            return (await clerk.session?.getToken({ template: "convex", skipCache: false })) ?? null;
          });
          const primaryEmail = clerk.user.primaryEmailAddress?.emailAddress || clerk.user.emailAddresses[0]?.emailAddress;
          const name = clerk.user.fullName || clerk.user.username || primaryEmail?.split("@")[0] || "Team member";
          setAuth({
            status: "signed_in",
            clerk,
            identity: { name, color: colorForSubject(clerk.user.id) },
          });
        };
        unsubscribe = clerk.addListener(syncAuth);
        syncAuth();
      })
      .catch((error: unknown) => {
        if (active) setAuth({ status: "error", message: error instanceof Error ? error.message : "Clerk could not start." });
      });

    return () => {
      active = false;
      unsubscribe?.();
      convex.clearAuth();
    };
  }, []);

  if (!convex || !clerkPublishableKey) {
    return (
      <main className="board-setup">
        <div className="setup-card">
          <div className="brand-mark">O</div>
          <h1>Orbit needs its secure workspace</h1>
          <p>Add the Convex URL and Clerk publishable key to your local environment, then restart the site.</p>
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
    return <ClerkSignIn clerk={auth.clerk} />;
  }

  return (
    <ConvexProvider client={convex}>
      <Board identity={auth.identity} clerk={auth.clerk} />
    </ConvexProvider>
  );
}

function ClerkSignIn({ clerk }: { clerk: Clerk }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const element = container.current;
    clerk.mountSignIn(element);
    return () => clerk.unmountSignIn(element);
  }, [clerk]);

  return (
    <main className="board-setup auth-setup">
      <section className="auth-shell">
        <div className="auth-intro"><div className="brand-mark">O</div><span>orbit</span><h1>Welcome to the team workspace</h1><p>Sign in with Clerk to access the shared Convex task board.</p></div>
        <div ref={container} className="clerk-sign-in" />
      </section>
    </main>
  );
}

function ClerkUserButton({ clerk }: { clerk: Clerk }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const element = container.current;
    clerk.mountUserButton(element);
    return () => clerk.unmountUserButton(element);
  }, [clerk]);

  return <div ref={container} className="clerk-user-button" />;
}

function Board({ identity, clerk }: { identity: SignedInIdentity; clerk: Clerk }) {
  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);
  const seed = useMutation(api.tasks.seed);
  const heartbeat = useMutation(api.presence.heartbeat);
  const [clock, setClock] = useState(Date.now());
  const activePeople = useQuery(api.presence.active, { since: clock - 35_000 });
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [modal, setModal] = useState<{ status: Status; task?: Doc<"tasks"> } | null>(null);
  const [dragging, setDragging] = useState<Id<"tasks"> | null>(null);
  const seeded = useRef(false);

  useEffect(() => {
    const ping = () => {
      setClock(Date.now());
      void heartbeat({ color: identity.color });
    };
    ping();
    const timer = window.setInterval(ping, 15_000);
    return () => window.clearInterval(timer);
  }, [heartbeat, identity]);

  useEffect(() => {
    if (!seeded.current && tasks?.length === 0) {
      seeded.current = true;
      void seed({});
    }
  }, [seed, tasks]);

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
          <ClerkUserButton clerk={clerk} />
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
  current: { status: Status; task?: Doc<"tasks"> };
  currentUser: string;
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
