"use client";

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Flex,
  Text,
  TextField,
  Box,
} from "@radix-ui/themes";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css"; // required styles
import "@radix-ui/themes/styles.css";

type Task = {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
};

const STORAGE_KEY = "radix-todo-tasks";

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      try {
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  // Setup flatpickr
  useEffect(() => {
    if (dateInputRef.current) {
      flatpickr(dateInputRef.current, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        onChange: ([selected]) => {
          if (selected) {
            setDueDate(selected.toISOString());
          }
        },
      });
    }
  }, []);

  // Persist tasks
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Add task
  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      dueDate,
    };
    setTasks([...tasks, newTask]);
    setInput("");
    setDueDate("");
    if (dateInputRef.current) dateInputRef.current.value = ""; // reset picker UI
  }

  // Toggle task
  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  // Delete task
  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <Flex direction="column" align="center" gap="4" p="4" width="100vw" height="100vh">
      <form onSubmit={handleAddTask} style={{ width: "100%", maxWidth: 400 }}>
        <Flex direction="column" gap="2">
          <Flex gap="2">
            <TextField.Root
              placeholder="Add a new task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button type="submit">Add</Button>
          </Flex>

          <input
            ref={dateInputRef}
            placeholder="Pick due date"
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: 4,
              width: "100%",
            }}
          />
        </Flex>
      </form>

      {/* Task List */}
      <Box style={{ width: "100%", maxWidth: 400 }}>
        <Flex direction="column" gap="3">
          {tasks.map((task) => (
            <Flex key={task.id} direction="column" gap="1" style={{ borderBottom: "1px solid #eee", paddingBottom: 8 }}>
              <Flex align="center" gap="3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <Text
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    flex: 1,
                  }}
                >
                  {task.text}
                </Text>
                <Button
                  variant="ghost"
                  color="red"
                  onClick={() => deleteTask(task.id)}
                  style={{ padding: 0, minWidth: 24 }}
                >
                  ×
                </Button>
              </Flex>
              {task.dueDate && (
                <Text size="1" color="gray" ml="5">
                  Due: {new Date(task.dueDate).toLocaleString()}
                </Text>
              )}
            </Flex>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}
