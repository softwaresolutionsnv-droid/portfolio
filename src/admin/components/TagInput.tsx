import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/admin/ui/badge';
import { Input } from '@/admin/ui/input';

export function TagInput({
  value,
  onChange,
  placeholder = 'Typ en druk op Enter',
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const tag = draft.trim().replace(/,+$/, '');
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                className="cursor-pointer rounded-sm p-0.5 hover:bg-background/60"
                aria-label={`Verwijder tag ${tag}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={placeholder}
      />
    </div>
  );
}
