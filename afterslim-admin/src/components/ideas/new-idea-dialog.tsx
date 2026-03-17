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
  DialogTrigger,
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
import { PRIORITY_CONFIG, IDEA_CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";
import type { IdeaPriority } from "@/lib/types";

interface NewIdeaDialogProps {
  children: React.ReactNode;
}

export function NewIdeaDialog({ children }: NewIdeaDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IdeaPriority>("medium");
  const [category, setCategory] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [estimatedRevenue, setEstimatedRevenue] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Titulo e obrigatorio");
      return;
    }
    if (!description.trim()) {
      toast.error("Descricao e obrigatoria");
      return;
    }
    if (!category) {
      toast.error("Categoria e obrigatoria");
      return;
    }

    // In a real app, this would send data to the API
    toast.success("Ideia criada com sucesso");
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("");
    setEstimatedCost("");
    setEstimatedRevenue("");
    setTagInput("");
    setTags([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Ideia</DialogTitle>
          <DialogDescription>
            Adicione uma nova ideia ao pipeline para pesquisa e validacao.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="idea-title">Titulo</Label>
            <Input
              id="idea-title"
              placeholder="Ex: Nova formula de goma para sono"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="idea-description">Descricao</Label>
            <Textarea
              id="idea-description"
              placeholder="Descreva a ideia, publico-alvo e impacto esperado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Prioridade</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as IdeaPriority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
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
              <Label>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {IDEA_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimated Cost & Revenue */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="idea-cost">Custo Estimado (R$)</Label>
              <Input
                id="idea-cost"
                type="number"
                placeholder="0.00"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="idea-revenue">Receita Estimada (R$)</Label>
              <Input
                id="idea-revenue"
                type="number"
                placeholder="0.00"
                value={estimatedRevenue}
                onChange={(e) => setEstimatedRevenue(e.target.value)}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="grid gap-2">
            <Label htmlFor="idea-tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="idea-tags"
                placeholder="Adicione uma tag e pressione Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Plus className="h-4 w-4" />
            Criar Ideia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
