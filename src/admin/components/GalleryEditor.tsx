import { useRef, useState } from 'react';
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
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ImagePlus, Loader2, X } from 'lucide-react';
import { uploadImage } from '../api';
import { imagePreviewUrl } from '../supabase';
import type { GalleryItem } from '../types';
import { Button } from '@/admin/ui/button';
import { Input } from '@/admin/ui/input';

function GalleryTile({
  item,
  index,
  onAltChange,
  onRemove,
}: {
  item: GalleryItem;
  index: number;
  onAltChange: (alt: string) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.image });
  const preview = imagePreviewUrl(item.image);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex flex-col gap-2 rounded-md border border-border bg-card p-2 ${
        isDragging ? 'relative z-10 opacity-80 shadow-lg' : ''
      }`}
    >
      <div className="relative">
        {preview && (
          <img
            src={preview}
            alt=""
            className="aspect-[16/10] w-full rounded object-cover"
            loading="lazy"
          />
        )}
        <button
          type="button"
          className="absolute left-1.5 top-1.5 cursor-grab touch-none rounded bg-black/50 p-1 text-white active:cursor-grabbing"
          aria-label={`Versleep beeld ${index + 1}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1.5 top-1.5 cursor-pointer rounded bg-black/50 p-1 text-white transition-colors hover:bg-destructive"
          aria-label={`Verwijder beeld ${index + 1}`}
        >
          <X className="size-3.5" />
        </button>
      </div>
      <Input
        value={item.alt}
        onChange={(e) => onAltChange(e.target.value)}
        placeholder="Alt-tekst (beschrijf het beeld)"
        className="h-8 text-xs"
      />
    </div>
  );
}

/**
 * Case-study gallery: multi-upload, drag to reorder, alt text per image.
 */
export function GalleryEditor({
  items,
  slugHint,
  onChange,
}: {
  items: GalleryItem[];
  slugHint: string;
  onChange: (items: GalleryItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const added: GalleryItem[] = [];
      for (const file of Array.from(files)) {
        const key = await uploadImage(file, slugHint);
        added.push({ image: key, alt: '' });
      }
      onChange([...items, ...added]);
    } catch (err) {
      toast.error('Upload mislukt', { description: (err as Error).message });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.image === active.id);
    const newIndex = items.findIndex((i) => i.image === over.id);
    onChange(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items.map((i) => i.image)} strategy={rectSortingStrategy}>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((item, index) => (
                <GalleryTile
                  key={item.image}
                  item={item}
                  index={index}
                  onAltChange={(alt) =>
                    onChange(items.map((it, i) => (i === index ? { ...it, alt } : it)))
                  }
                  onRemove={() => onChange(items.filter((_, i) => i !== index))}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          Beelden toevoegen
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => void onFiles(e.target.files)}
      />
    </div>
  );
}
