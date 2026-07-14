import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { RoomOption } from '../constants/bookingContent';
import { fetchRooms, mapRoomToOption } from '../services/roomsService';

type RoomsCatalogContextValue = {
  rooms: RoomOption[];
  loading: boolean;
  error: string | null;
  fromRatePerNight: number;
  refetch: () => void;
};

const RoomsCatalogContext = createContext<RoomsCatalogContextValue | null>(null);

export function RoomsCatalogProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchRooms()
      .then((apiRooms) => {
        if (cancelled) return;
        setRooms(apiRooms.map(mapRoomToOption));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load rooms');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  const refetch = useCallback(() => setRefreshToken((token) => token + 1), []);

  const fromRatePerNight = useMemo(
    () => (rooms.length > 0 ? Math.min(...rooms.map((room) => room.price)) : 0),
    [rooms],
  );

  const value = useMemo(
    () => ({ rooms, loading, error, fromRatePerNight, refetch }),
    [rooms, loading, error, fromRatePerNight, refetch],
  );

  return <RoomsCatalogContext.Provider value={value}>{children}</RoomsCatalogContext.Provider>;
}

export function useRoomsCatalog() {
  const ctx = useContext(RoomsCatalogContext);
  if (!ctx) throw new Error('useRoomsCatalog must be used within a RoomsCatalogProvider');
  return ctx;
}
