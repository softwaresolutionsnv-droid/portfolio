import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/admin/ui/button';
import { Input } from '@/admin/ui/input';
import { Textarea } from '@/admin/ui/textarea';

function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Ordered list of multi-line strings (e.g. case-study paragraphs). */
export function StringListEditor({
  items,
  onChange,
  addLabel,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((text, index) => (
        <div key={index} className="flex gap-2">
          <Textarea
            value={text}
            placeholder={placeholder}
            onChange={(e) =>
              onChange(items.map((t, i) => (i === index ? e.target.value : t)))
            }
            className="min-h-24"
          />
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={index === 0}
              onClick={() => onChange(move(items, index, index - 1))}
              aria-label="Omhoog"
            >
              <ArrowUp />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={index === items.length - 1}
              onClick={() => onChange(move(items, index, index + 1))}
              aria-label="Omlaag"
            >
              <ArrowDown />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-destructive"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Verwijderen"
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      ))}
      <div>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ''])}>
          <Plus />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}

export type PairField = {
  key: string;
  placeholder: string;
  multiline?: boolean;
  /** Tailwind width class for the field; defaults to flex-1. */
  className?: string;
};

/**
 * Ordered list of small records with two-or-so string fields
 * (highlights, socials, about-details, skills-picks).
 */
export function PairListEditor({
  items,
  onChange,
  fields,
  addLabel,
}: {
  items: Record<string, string>[];
  onChange: (items: Record<string, string>[]) => void;
  fields: PairField[];
  addLabel: string;
}) {
  const emptyItem = () =>
    Object.fromEntries(fields.map((f) => [f.key, ''])) as Record<string, string>;

  const update = (index: number, key: string, value: string) =>
    onChange(items.map((it, i) => (i === index ? { ...it, [key]: value } : it)));

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          {fields.map((field) =>
            field.multiline ? (
              <Textarea
                key={field.key}
                value={item[field.key] ?? ''}
                placeholder={field.placeholder}
                onChange={(e) => update(index, field.key, e.target.value)}
                className={field.className ?? 'flex-1'}
              />
            ) : (
              <Input
                key={field.key}
                value={item[field.key] ?? ''}
                placeholder={field.placeholder}
                onChange={(e) => update(index, field.key, e.target.value)}
                className={field.className ?? 'flex-1'}
              />
            )
          )}
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={index === 0}
              onClick={() => onChange(move(items, index, index - 1))}
              aria-label="Omhoog"
            >
              <ArrowUp />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-destructive"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Verwijderen"
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      ))}
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, emptyItem()])}
        >
          <Plus />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
