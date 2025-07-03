"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Flex,
  Text,
  TextField,
  Box,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

type Task = {
  id: number;
  text: string;
  completed: boolean;
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
    };
    setTasks([...tasks, newTask]);
    setInput("");
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
      {/* Task Input */}
      <form onSubmit={handleAddTask} style={{ width: "100%", maxWidth: 400 }}>
        <Flex gap="2">
          <TextField.Root
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="submit">Add</Button>
        </Flex>
      </form>

      {/* Task List */}
      <Box style={{ width: "100%", maxWidth: 400 }}>
        <Flex direction="column" gap="3">
          {tasks.map((task) => (
            <Flex key={task.id} align="center" gap="3">
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
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}
