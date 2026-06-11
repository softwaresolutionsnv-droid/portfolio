import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, GripVertical, ImageOff, Plus } from 'lucide-react';
import { getProjects, saveProjectOrder } from '../api';
import { imagePreviewUrl } from '../supabase';
import type { ProjectRow } from '../types';
import { Badge } from '@/admin/ui/badge';
import { Button } from '@/admin/ui/button';
import { Skeleton } from '@/admin/ui/skeleton';

function ProjectListRow({ project }: { project: ProjectRow }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  const thumb = imagePreviewUrl(project.image);

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 border-b border-border bg-card px-3 py-3 first:rounded-t-lg last:rounded-b-lg last:border-b-0 ${
        isDragging ? 'relative z-10 opacity-80 shadow-lg' : ''
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label={`Versleep ${project.title}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => navigate(`/projecten/${project.id}`)}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
      >
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="h-12 w-20 shrink-0 rounded-md border border-border object-cover"
            loading="lazy"
          />
        ) : (
          <div className="grid h-12 w-20 shrink-0 place-items-center rounded-md border border-border bg-secondary text-muted-foreground">
            <ImageOff className="size-4" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{project.title || 'Zonder titel'}</p>
          <p className="truncate text-xs text-muted-foreground">
            {[project.client, project.year].filter(Boolean).join(' · ')}
          </p>
        </div>
        {project.published ? (
          <Badge variant="secondary">Live</Badge>
        ) : (
          <Badge variant="outline">Concept</Badge>
        )}
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </button>
    </li>
  );
}

export function ProjectList() {
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((err: Error) => {
        toast.error('Projecten laden mislukt', { description: err.message });
        setProjects([]);
      });
  }, []);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!projects || !over || active.id === over.id) return;
    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);
    setProjects(reordered);
    saveProjectOrder(reordered.map((p) => p.id)).catch((err: Error) =>
      toast.error('Volgorde opslaan mislukt', { description: err.message })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Projecten</h1>
          <p className="text-sm text-muted-foreground">
            Sleep om de volgorde op de site te bepalen.
          </p>
        </div>
        <Button asChild>
          <Link to="/projecten/nieuw">
            <Plus />
            Nieuw project
          </Link>
        </Button>
      </div>

      {projects === null ? (
        <div className="space-y-2">
          <Skeleton className="h-[72px] w-full" />
          <Skeleton className="h-[72px] w-full" />
          <Skeleton className="h-[72px] w-full" />
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Nog geen projecten. Voeg je eerste project toe.
          </p>
          <Button asChild>
            <Link to="/projecten/nieuw">
              <Plus />
              Nieuw project
            </Link>
          </Button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="rounded-lg border border-border">
              {projects.map((project) => (
                <ProjectListRow key={project.id} project={project} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
