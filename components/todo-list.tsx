"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useTodoStore } from "@/store/todo";

export default function TodoList() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    filter,
    setFilter,
  } = useTodoStore();

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const filteredTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "completed") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  const remainingTasks = todos.filter((t) => !t.done).length;

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  const submitTodo = () => {
    if (!text.trim()) return;
    addTodo(text.trim());
    setText("");
  };

  return (
    <div>
      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitTodo()}
          placeholder="Add new task"
          className="w-full flex-1 h-[56px] sm:h-[59px] px-5 rounded-2xl border outline-none shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
          style={{
            backgroundColor: "var(--ui-bg)",
            color: "var(--input-text)",
            borderColor: "var(--border)",
          }}
        />

        <button
          onClick={submitTodo}
          className="w-full sm:w-[143px] h-[56px] sm:h-[59px] rounded-2xl text-[16px] font-medium flex items-center justify-center gap-2 shrink-0 bg-black dark:bg-[#364153] !text-white"
        >
          <span className="text-[22px] leading-none">+</span>
          <span>Add</span>
        </button>
      </div>

      {/* Tabs */}
      {todos.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex flex-wrap items-center gap-y-2 text-[15px]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setFilter(tab.key as "all" | "active" | "completed")
                }
                className="px-3 sm:px-4 border-r border-gray-300 last:border-r-0 pb-1 transition font-medium"
                style={{
                  color:
                    filter === tab.key
                      ? "var(--tab-active)"
                      : "var(--tab-inactive)",
                  borderBottom:
                    filter === tab.key ? "1px solid var(--tab-active)" : "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-sm" style={{ color: "var(--tab-inactive)" }}>
            {remainingTasks} Remaining tasks
          </p>
        </div>
      )}

      {/* Empty State */}
      {filteredTodos.length === 0 ? (
        <div className="flex flex-col md:flex-row items-center gap-6 mt-10 text-center md:text-left">
          <Image
            src="/images/selfie.png"
            alt="Empty"
            width={220}
            height={220}
            priority
            className="rounded-full object-cover w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px]"
          />

          <div className="max-w-[520px]">
            <p
              className="text-[18px] sm:text-[20px] font-medium leading-relaxed"
              style={{ color: "var(--text)" }}
            >
              Thought Empty as my motivation on Monday 😅
              <br />
              Let's start adding stuff!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-5 py-4 rounded-2xl border shadow-[0_6px_14px_rgba(0,0,0,0.06)]"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                  className="mt-1 sm:mt-0 h-4 w-4 accent-black shrink-0"
                />

                {editingId === todo.id ? (
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full border-b bg-transparent outline-none py-1"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  />
                ) : (
                  <p
                    className="break-words"
                    style={{
                      color: todo.done ? "var(--muted)" : "var(--text)",
                      textDecoration: todo.done ? "line-through" : "none",
                    }}
                  >
                    {todo.text}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                {editingId === todo.id ? (
                  <button
                    onClick={() => {
                      editTodo(todo.id, editingText);
                      setEditingId(null);
                    }}
                    className="text-sm"
                    style={{ color: "var(--text)" }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingText(todo.text);
                    }}
                    style={{ color: "var(--text)" }}
                  >
                    <Pencil size={18} />
                  </button>
                )}

                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{ color: "var(--text)" }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p
        className="text-center mt-auto pt-50 text-sm"
        style={{ color: "var(--muted)" }}
      >
        © 2026
      </p>
    </div>
  );
}
