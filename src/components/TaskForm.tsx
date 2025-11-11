import { useState } from "react";
import { Task, TaskPriority } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaskFormProps {
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void;
}

export const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive",
      });
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: "todo",
    });

    setTitle("");
    setDescription("");
    setPriority("medium");

    toast({
      title: "¡Tarea creada!",
      description: "Tu tarea se ha agregado correctamente",
    });
  };

  return (
    <Card className="p-6 bg-card border-border shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Título de la tarea
          </label>
          <Input
            id="title"
            placeholder="¿Qué necesitas hacer?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background border-border"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Descripción (opcional)
          </label>
          <Textarea
            id="description"
            placeholder="Agrega más detalles..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background border-border min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="priority" className="text-sm font-medium text-foreground">
            Prioridad
          </label>
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as TaskPriority)}
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Crear Tarea
        </Button>
      </form>
    </Card>
  );
};
