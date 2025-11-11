import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
}

const statusColors = {
  todo: "bg-todo/10 text-todo border-todo/30",
  "in-progress": "bg-warning/10 text-warning border-warning/30",
  completed: "bg-success/10 text-success border-success/30",
};

export const TaskColumn = ({
  status,
  title,
  tasks,
  onDeleteTask,
}: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <Badge className={statusColors[status]} variant="outline">
          {tasks.length}
        </Badge>
      </div>
      <Card
        ref={setNodeRef}
        className={`flex-1 p-4 bg-muted/30 border-2 transition-all duration-200 ${
          isOver ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay tareas aquí
              </p>
            ) : (
              tasks.map((task) => (
                <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
              ))
            )}
          </div>
        </SortableContext>
      </Card>
    </div>
  );
};
