import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BookOpen, Plus, Heart, Share2, Camera, Loader2, Globe, Edit3, Trash2, X } from "lucide-react";

const MOODS = ["Amazing", "Great", "Good", "Neutral", "Challenging"];
const MOOD_EMOJIS = { Amazing: "🤩", Great: "😊", Good: "🙂", Neutral: "😐", Challenging: "😅" };

function JournalCard({ entry, onDelete }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="rounded-3xl overflow-hidden card-glass group hover:shadow-xl transition-all duration-300">
      {entry.cover_image && (
        <div className="h-52 overflow-hidden">
          <img src={entry.cover_image} alt={entry.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            {entry.mood && (
              <span className="text-2xl mr-2">{MOOD_EMOJIS[entry.mood]}</span>
            )}
            <h3 className="font-bold text-lg inline" style={{ color: "var(--text-primary)" }}>{entry.title}</h3>
          </div>
          <button onClick={() => onDelete(entry.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-red-50">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>{entry.destination_name}</span>
          {entry.travel_date && (
            <>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {new Date(entry.travel_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </>
          )}
        </div>

        <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: "var(--text-secondary)" }}>
          {entry.content || "A memorable travel experience worth documenting..."}
        </p>

        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {entry.tags.map(tag => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs"
                style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
          <button onClick={() => setLiked(!liked)}
            className="flex items-center gap-2 text-sm transition-all"
            style={{ color: liked ? "var(--accent)" : "var(--text-muted)" }}>
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            <span>{(entry.likes || 0) + (liked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

function WriteJournalModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "", destination_name: "", content: "", travel_date: "", mood: "Great",
    tags: "", cover_image: "", is_public: true, rating: 5
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!form.title || !form.destination_name) return;
    setLoading(true);
    const data = {
      ...form,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
    };
    await onCreate(data);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden my-4" style={{ backgroundColor: "var(--bg-card)" }}>
        <div className="p-6 flex items-center justify-between border-b" style={{ borderColor: "var(--border-color)" }}>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>New Journal Entry</h2>
          <button onClick={onClose} className="p-2 rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <X className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Give your journey a title..."
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none font-medium"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={form.destination_name} onChange={e => setForm({ ...form, destination_name: e.target.value })}
              placeholder="Destination (e.g. Bali, Indonesia)"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
            <input type="date" value={form.travel_date} onChange={e => setForm({ ...form, travel_date: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>How was it?</p>
            <div className="flex gap-2">
              {MOODS.map(mood => (
                <button key={mood} onClick={() => setForm({ ...form, mood })}
                  className="flex-1 py-2 rounded-xl text-sm transition-all"
                  style={{
                    backgroundColor: form.mood === mood ? "var(--accent-soft)" : "var(--bg-secondary)",
                    color: form.mood === mood ? "var(--accent)" : "var(--text-secondary)",
                    border: form.mood === mood ? "1.5px solid var(--accent)" : "1.5px solid transparent",
                    fontWeight: form.mood === mood ? "600" : "400"
                  }}>
                  {MOOD_EMOJIS[mood]}
                </button>
              ))}
            </div>
          </div>

          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
            placeholder="Tell your story... What did you see? How did it make you feel? What would you tell others?"
            rows={6}
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none leading-relaxed"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />

          <input type="url" value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })}
            placeholder="Cover photo URL (optional)"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />

          <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
            placeholder="Tags (comma separated: sunset, beach, culture)"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />

          <div className="flex items-center gap-3">
            <button onClick={() => setForm({ ...form, is_public: !form.is_public })}
              className="w-11 h-6 rounded-full transition-all relative"
              style={{ backgroundColor: form.is_public ? "var(--accent)" : "var(--border-color)" }}>
              <span className="absolute top-0.5 rounded-full w-5 h-5 bg-white transition-all shadow"
                style={{ left: form.is_public ? "calc(100% - 22px)" : "2px" }} />
            </button>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {form.is_public ? "Public – others can see this" : "Private – only you can see this"}
            </span>
          </div>
        </div>
        <div className="p-6 flex gap-3 border-t" style={{ borderColor: "var(--border-color)" }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl text-sm font-medium"
            style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Cancel</button>
          <button onClick={handleCreate} disabled={!form.title || !form.destination_name || loading}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white btn-primary disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Edit3 className="w-4 h-4" /> Publish Entry</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    base44.entities.TravelJournal.list("-created_date", 50).then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (form) => {
    const entry = await base44.entities.TravelJournal.create(form);
    setEntries(prev => [entry, ...prev]);
  };

  const handleDelete = async (id) => {
    await base44.entities.TravelJournal.delete(id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const filtered = tab === "mine" ? entries.filter(e => !e.is_public) : entries;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="py-16 px-6" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5" style={{ color: "var(--accent)" }} />
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>Travel Stories</span>
            </div>
            <h1 className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>My Travel Journal</h1>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Document and share your adventures</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white btn-primary">
            <Edit3 className="w-4 h-4" /> Write Entry
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>No journal entries yet</h3>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>Start documenting your travel memories!</p>
            <button onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-2xl text-sm font-semibold text-white btn-primary">
              Write Your First Entry
            </button>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map(entry => (
              <div key={entry.id} className="break-inside-avoid">
                <JournalCard entry={entry} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <WriteJournalModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
}