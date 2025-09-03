'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = { selectedLocation?: string; city?: string; state?: string; limit?: number };

type Theater = { id: string; name: string; rating: number; image: string; url: string };

export default function LocalTheaters({ selectedLocation, city, state, limit = 8 }: Props) {
  const parsed = useMemo(() => {
    if (city && state) return { city, state };
    if (selectedLocation) {
      const [c, s] = selectedLocation.split(',').map((x) => x.trim());
      if (c && s) return { city: c, state: s };
    }
    return { city: 'Austin', state: 'TX' };
  }, [selectedLocation, city, state]);

  const [items, setItems] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ city: parsed.city, state: parsed.state, limit: String(limit) });
        const res = await fetch(`/api/local-theaters?${qs.toString()}`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) {
          console.error('LocalTheaters API error:', json);
          setError(json?.error || 'Failed to load theaters');
          setItems([]);
        } else {
          setItems(json.theaters ?? []);
        }
      } catch (e) {
        console.error('LocalTheaters API exception:', e);
        setError('Failed to load theaters');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [parsed.city, parsed.state, limit]);

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">🎟️ Movie Theaters Near You</h3>
      {loading ? (
        <div className="text-sm text-gray-600">Loading theaters…</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-600">No theaters found.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((t) => (
            <li key={t.id} className="flex items-center gap-3">
              {t.image ? <img src={t.image} alt={t.name} className="w-14 h-14 object-cover rounded" loading="lazy" /> : <div className="w-14 h-14 rounded bg-gray-200" />}
              <div className="min-w-0">
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {t.name}
                </a>
                <div className="text-xs text-gray-600">⭐ {t.rating ?? '—'}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
