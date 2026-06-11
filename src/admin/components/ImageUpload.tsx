import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { uploadImage } from '../api';
import { imagePreviewUrl } from '../supabase';
import { Button } from '@/admin/ui/button';

/**
 * Single-image upload. Stores the storage object key via onChange; the
 * build pipeline turns it into WebP variants when the site is published.
 */
export function ImageUpload({
  value,
  slugHint,
  onChange,
}: {
  value: string | null;
  /** Used as the storage folder so uploads group per project. */
  slugHint: string;
  onChange: (key: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const preview = imagePreviewUrl(value);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const key = await uploadImage(file, slugHint);
      onChange(key);
    } catch (err) {
      toast.error('Upload mislukt', { description: (err as Error).message });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {preview ? (
        <img
          src={preview}
          alt=""
          className="aspect-[16/10] w-full rounded-md border border-border object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="grid aspect-[16/10] w-full cursor-pointer place-items-center rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:bg-secondary/40"
        >
          <span className="flex flex-col items-center gap-2 text-sm">
            <ImagePlus className="size-6" />
            Kies een afbeelding
          </span>
        </button>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          {value ? 'Vervangen' : 'Uploaden'}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
          >
            <Trash2 />
            Verwijderen
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
    </div>
  );
}
