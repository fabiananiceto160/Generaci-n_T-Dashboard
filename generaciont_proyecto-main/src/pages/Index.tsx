import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Task, TaskStatus } from "@/types/task";
import { TaskForm } from "@/components/TaskForm";
import { TaskColumn } from "@/components/TaskColumn";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "taskboard-tasks";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "Tarea eliminada",
      description: "La tarea se ha eliminado correctamente",
    });
  };

  const handleClearCompleted = () => {
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    setTasks(tasks.filter((task) => task.status !== "completed"));
    toast({
      title: "Tareas completadas eliminadas",
      description: `Se eliminaron ${completedCount} tarea(s) completada(s)`,
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const completedCount = getTasksByStatus("completed").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-success/10" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
              TaskBoard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Organiza tu día, gestiona tus tareas y alcanza tus objetivos
            </p>
          </div>

          {/* Task Form */}
          <div className="max-w-2xl mx-auto mb-8">
            <TaskForm onAddTask={handleAddTask} />
          </div>
        </div>
      </div>

      {/* Stats and Actions */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>
              Total: <strong className="text-foreground">{tasks.length}</strong>
            </span>
            <span>
              Completadas:{" "}
              <strong className="text-success">{completedCount}</strong>
            </span>
          </div>
          {completedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCompleted}
              className="text-destructive hover:text-destructive border-destructive/30"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar completadas
            </Button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="container mx-auto px-4 pb-12">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskColumn
              status="todo"
              title="📋 Pendientes"
              tasks={getTasksByStatus("todo")}
              onDeleteTask={handleDeleteTask}
            />
            <TaskColumn
              status="in-progress"
              title="⚡ En Progreso"
              tasks={getTasksByStatus("in-progress")}
              onDeleteTask={handleDeleteTask}
            />
            <TaskColumn
              status="completed"
              title="✅ Completadas"
              tasks={getTasksByStatus("completed")}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} onDelete={() => {}} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default Index;
