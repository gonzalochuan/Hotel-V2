import { useEffect, useState } from 'react';
import { CalendarDays, LogOut, User } from 'lucide-react';
import { MotionDrawer } from '../ui/MotionDrawer';
import { useAuth } from '../../context/AuthContext';
import { fetchMyBookings, type Booking } from '../../services/bookingsApi';

type AccountDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function AccountDrawer({ isOpen, onClose }: AccountDrawerProps) {
  const { session, signInWithGoogle, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !session) return;
    setLoading(true);
    setError(null);
    fetchMyBookings(session.access_token)
      .then(setBookings)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [isOpen, session]);

  return (
    <MotionDrawer isOpen={isOpen} onClose={onClose} direction="right" width={420}>
      <div className="flex h-full flex-col p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-linen">
            <User size={20} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/50">Account</p>
            <p className="truncate text-lg font-light">{session?.user.email ?? 'Not signed in'}</p>
          </div>
        </div>

        {!session ? (
          <div className="mt-10 flex flex-col gap-4">
            <p className="text-sm text-ink/60">Sign in to view your bookings.</p>
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className="h-12 rounded-full bg-ink text-sm font-bold uppercase tracking-wide text-linen transition hover:bg-palm"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.15em] text-ink/50">Your bookings</p>

            <div className="mt-4 flex-1 overflow-y-auto">
              {loading ? <p className="text-sm text-ink/50">Loading…</p> : null}
              {error ? <p className="text-sm text-coral">{error}</p> : null}
              {!loading && !error && bookings.length === 0 ? (
                <p className="text-sm text-ink/50">No bookings yet.</p>
              ) : null}

              <div className="flex flex-col gap-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex gap-3 rounded-[1.25rem] border border-ink/12 p-4">
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-ink/5">
                      {booking.roomImage ? (
                        <img src={booking.roomImage} alt={booking.roomName ?? ''} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold uppercase tracking-wide">
                          {booking.roomName ?? 'Room'}
                        </p>
                        <span className="shrink-0 rounded-full bg-palm/15 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-palm">
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
                        <CalendarDays size={13} />
                        {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                      </p>
                      <p className="mt-1 text-sm font-light">PHP {booking.total.toLocaleString('en-PH')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full border border-ink/20 text-sm font-bold uppercase tracking-wide transition hover:bg-ink hover:text-linen"
            >
              <LogOut size={15} /> Sign out
            </button>
          </>
        )}
      </div>
    </MotionDrawer>
  );
}
