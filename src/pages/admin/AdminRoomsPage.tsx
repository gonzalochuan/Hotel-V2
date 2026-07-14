import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { ImagePlus, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import {
  type ApiRoom,
  type RoomFormInput,
  createRoom,
  deleteRoom,
  deleteRoomImage,
  fetchRooms,
  updateRoom,
  uploadRoomImage,
} from '../../services/roomsService';
import { useRoomsCatalog } from '../../context/RoomsCatalogContext';

const EMPTY_FORM: RoomFormInput = {
  name: '',
  description: '',
  roomType: '',
  price: 0,
  capacity: 1,
  sizeSqm: 0,
  features: [],
  amenities: [],
};

function parseLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseAmenities(value: string) {
  return parseLines(value)
    .map((line) => {
      const [icon, ...rest] = line.split(':');
      const label = rest.join(':').trim();
      return icon && label ? { icon: icon.trim(), label } : null;
    })
    .filter((entry): entry is { icon: string; label: string } => entry !== null);
}

function inputClass(extra = '') {
  return `rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm text-ink outline-none transition focus:border-ink/40 ${extra}`;
}

export function AdminRoomsPage() {
  const { refetch: refetchPublicCatalog } = useRoomsCatalog();
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RoomFormInput>(EMPTY_FORM);
  const [featuresText, setFeaturesText] = useState('');
  const [amenitiesText, setAmenitiesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingRoomId, setUploadingRoomId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadRooms = () => {
    setLoading(true);
    setError(null);
    fetchRooms()
      .then(setRooms)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load rooms'))
      .finally(() => setLoading(false));
  };

  useEffect(loadRooms, []);

  const editingRoom = useMemo(() => rooms.find((room) => room.id === editingId) ?? null, [rooms, editingId]);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFeaturesText('');
    setAmenitiesText('');
  };

  const startEdit = (room: ApiRoom) => {
    setEditingId(room.id);
    setForm({
      name: room.name,
      description: room.description,
      roomType: room.roomType,
      price: room.price,
      capacity: room.capacity,
      sizeSqm: room.sizeSqm,
      features: room.features,
      amenities: room.amenities,
    });
    setFeaturesText(room.features.join('\n'));
    setAmenitiesText(room.amenities.map((a) => `${a.icon}:${a.label}`).join('\n'));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: RoomFormInput = {
      ...form,
      features: parseLines(featuresText),
      amenities: parseAmenities(amenitiesText),
    };

    try {
      if (editingId) {
        await updateRoom(editingId, payload);
      } else {
        const created = await createRoom(payload);
        setEditingId(created.id);
      }
      loadRooms();
      refetchPublicCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save room');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this room and all its images?')) return;
    setDeletingId(id);
    try {
      await deleteRoom(id);
      if (editingId === id) resetForm();
      loadRooms();
      refetchPublicCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete room');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpload = async (roomId: string, file: File) => {
    setUploadingRoomId(roomId);
    try {
      await uploadRoomImage(roomId, file);
      loadRooms();
      refetchPublicCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingRoomId(null);
    }
  };

  const handleDeleteImage = async (roomId: string, imageId: string) => {
    try {
      await deleteRoomImage(roomId, imageId);
      loadRooms();
      refetchPublicCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-linen font-display text-ink">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-ink/10 bg-linen px-6 py-4 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-palm">Back office</p>
          <h1 className="text-2xl font-light uppercase leading-tight sm:text-3xl">Room Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          {error ? (
            <span className="rounded-full border border-coral/30 bg-coral/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-coral">
              {error}
            </span>
          ) : null}
          <span className="rounded-full border border-ink/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink/60">
            {loading ? 'Loading…' : `${rooms.length} room${rooms.length === 1 ? '' : 's'}`}
          </span>
        </div>
      </header>

      {/* Body: two panes, each scrolls independently — page itself never scrolls */}
      <div className="flex min-h-0 flex-1">
        {/* Room list */}
        <aside className="flex w-[320px] shrink-0 flex-col border-r border-ink/10 sm:w-[360px]">
          <div className="shrink-0 p-4">
            <button
              type="button"
              onClick={resetForm}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-bold uppercase tracking-wide text-linen transition hover:bg-palm"
            >
              <Plus size={16} strokeWidth={2.5} /> New room
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            {loading ? (
              <p className="px-1 py-6 text-center text-sm text-ink/50">Loading rooms…</p>
            ) : (
              <div className="flex flex-col gap-2">
                {rooms.map((room) => {
                  const isActive = room.id === editingId;
                  const thumb = room.images[0]?.url;
                  return (
                    <button
                      type="button"
                      key={room.id}
                      onClick={() => startEdit(room)}
                      className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                        isActive ? 'border-ink bg-ink text-linen' : 'border-ink/10 hover:border-ink/30'
                      }`}
                    >
                      <div
                        className={`h-12 w-14 shrink-0 overflow-hidden rounded-lg ${
                          isActive ? 'bg-linen/20' : 'bg-ink/5'
                        }`}
                      >
                        {thumb ? (
                          <img src={thumb} alt={room.name} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold uppercase tracking-wide">{room.name}</p>
                        <p className={`truncate text-xs ${isActive ? 'text-linen/70' : 'text-ink/50'}`}>
                          {room.roomType} · PHP {room.price.toLocaleString('en-PH')}
                        </p>
                      </div>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(room.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.stopPropagation();
                            handleDelete(room.id);
                          }
                        }}
                        aria-label={`Delete ${room.name}`}
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${
                          isActive ? 'text-linen/70 hover:bg-linen/15' : 'text-ink/40 hover:bg-coral/10 hover:text-coral'
                        }`}
                      >
                        {deletingId === room.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </span>
                    </button>
                  );
                })}
                {!loading && rooms.length === 0 ? (
                  <p className="px-1 py-6 text-center text-sm text-ink/50">No rooms yet — create one.</p>
                ) : null}
              </div>
            )}
          </div>
        </aside>

        {/* Editor */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-6 sm:px-10">
            <div className="flex items-center gap-2">
              {editingId ? <Pencil size={16} className="text-palm" /> : <Plus size={16} className="text-palm" />}
              <h2 className="text-lg font-bold uppercase tracking-wide">
                {editingId ? `Edit — ${editingRoom?.name ?? ''}` : 'New room'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-ink/12 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-ink/60">
                  Name
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputClass()}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-ink/60">
                  Room type
                  <input
                    required
                    value={form.roomType}
                    onChange={(e) => setForm((f) => ({ ...f, roomType: e.target.value }))}
                    className={inputClass()}
                    placeholder="Suite, Room, Villa..."
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-ink/60">
                Description
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={inputClass('resize-none')}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-ink/60">
                  Price / night
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className={inputClass()}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-ink/60">
                  Capacity
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))}
                    className={inputClass()}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-ink/60">
                  Size (sqm)
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.sizeSqm}
                    onChange={(e) => setForm((f) => ({ ...f, sizeSqm: Number(e.target.value) }))}
                    className={inputClass()}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-ink/60">
                  Features (one per line)
                  <textarea
                    rows={3}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    className={inputClass('resize-none')}
                    placeholder={'King bed\nOcean view\nPrivate balcony'}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-ink/60">
                  Amenities (IconName:Label)
                  <textarea
                    rows={3}
                    value={amenitiesText}
                    onChange={(e) => setAmenitiesText(e.target.value)}
                    className={inputClass('resize-none')}
                    placeholder={'Wifi:WiFi\nTv:55" LED TV'}
                  />
                </label>
              </div>

              <div className="flex gap-3 border-t border-ink/10 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold uppercase tracking-wide text-linen transition hover:bg-palm disabled:opacity-50"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create room'}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="h-11 rounded-full border border-ink/20 px-6 text-sm font-bold uppercase tracking-wide transition hover:bg-ink/5"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>

            {/* Images — only for an existing room */}
            {editingRoom ? (
              <div className="rounded-2xl border border-ink/12 p-5 sm:p-6">
                <h3 className="text-xs font-bold uppercase tracking-wide text-ink/60">Photos</h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {editingRoom.images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-ink/10"
                    >
                      <img src={image.url} alt={editingRoom.name} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(editingRoom.id, image.id)}
                        className="absolute right-1 top-1 hidden h-6 w-6 place-items-center rounded-full bg-ink/80 text-linen group-hover:grid"
                        aria-label="Remove image"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}

                  <label className="grid h-24 w-32 shrink-0 cursor-pointer place-items-center gap-1 rounded-lg border border-dashed border-ink/25 text-ink/45 transition hover:border-ink/50 hover:text-ink/70">
                    {uploadingRoomId === editingRoom.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ImagePlus size={18} />
                    )}
                    <span className="text-[0.65rem] font-bold uppercase tracking-wide">
                      {uploadingRoomId === editingRoom.id ? 'Uploading' : 'Add photo'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingRoomId === editingRoom.id}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(editingRoom.id, file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-ink/15 p-5 text-center text-sm text-ink/45">
                Save this room first to add photos.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
