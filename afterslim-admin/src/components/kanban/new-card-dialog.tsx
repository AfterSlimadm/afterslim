"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_CONFIG } from "@/lib/constants";
import { toast } from "sonner";
import type { IdeaPriority, KanbanColumn } from "@/lib/types";

interface NewCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: KanbanColumn[];
  defaultColumnId?: string;
  onCreateCard?: (card: {
    title: string;
    description: string;
    priority: IdeaPriority;
    assignee: string;
    dueDate: string;
    labels: string[];
    columnId: string;
  }) => void;
}

export function NewCardDialog({
  open,
  onOpenChange,
  columns,
  defaultColumnId,
  onCreateCard,
}: NewCardDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IdeaPriority>("medium");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [columnId, setColumnId] = useState(defaultColumnId ?? columns[0]?.id ?? "");

  const handleAddLabel = () => {
    const trimmed = labelInput.trim();
    if (trimmed && !labels.includes(trimmed)) {
      setLabels((prev) => [...prev, trimmed]);
      setLabelInput("");
    }
  };

  const handleRemoveLabel = (label: string) => {
    setLabels((prev) => prev.filter((l) => l !== label));
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLabel();
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    onCreateCard?.({
      title: title.trim(),
      description: description.trim(),
      priority,
      assignee: assignee.trim(),
      dueDate,
      labels,
      columnId,
    });

    toast.success("Card created successfully");
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignee("");
    setDueDate("");
    setLabelInput("");
    setLabels([]);
    setColumnId(defaultColumnId ?? columns[0]?.id ?? "");
  };

  // Sync defaultColumnId when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open && defaultColumnId) {
      setColumnId(defaultColumnId);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Card</DialogTitle>
          <DialogDescription>
            Add a new task card to the board.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="card-title">Title</Label>
            <Input
              id="card-title"
              placeholder="e.g. Design new product labels"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="card-desc">Description</Label>
            <Textarea
              id="card-desc"
              placeholder="Describe the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Priority & Column */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as IdeaPriority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Column</Label>
              <Select value={columnId} onValueChange={setColumnId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="card-assignee">Assignee</Label>
              <Input
                id="card-assignee"
                placeholder="e.g. John Doe"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-due">Due Date</Label>
              <Input
                id="card-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Labels */}
          <div className="grid gap-2">
            <Label htmlFor="card-labels">Labels</Label>
            <div className="flex gap-2">
              <Input
                id="card-labels"
                placeholder="Add a label and press Enter"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={handleLabelKeyDown}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLabel}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {labels.map((label) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="gap-1 text-xs"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => handleRemoveLabel(label)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Plus className="h-4 w-4" />
            Create Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
