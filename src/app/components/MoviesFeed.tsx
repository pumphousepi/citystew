'use client';

import { useEffect, useState } from 'react';

type Props = { region?: string }; // country code, e.g., US
type Movie = { id: string; title: string; releaseDate: string; poster: string };

export default function MoviesFeed({ region = 'US' }: Props) {
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/movies?region=${encodeURIComponent(region)}`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) {
          console.error('Movies API error:', json);
          setError(json?.error || 'Failed to load movies');
          setItems([]);
        } else {
          setItems(json.movies ?? []);
        }
      } catch (e) {
        console.error('Movies API exception:', e);
        setError('Failed to load movies');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [region]);

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">🎬 Now Playing</h3>
      {loading ? (
        <div className="text-sm text-gray-600">Loading movies…</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-600">No movies found.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((m) => (
            <div key={m.id} className="flex gap-3">
              {m.poster ? (
                <img src={m.poster} alt={m.title} className="w-16 h-24 object-cover rounded" loading="lazy" />
              ) : (
                <div className="w-16 h-24 rounded bg-gray-200" />
              )}
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{m.title}</div>
                <div className="text-xs text-gray-600">Release: {m.releaseDate || '—'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
