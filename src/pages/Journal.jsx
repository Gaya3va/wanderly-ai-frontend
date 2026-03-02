import { useState, useEffect } from "react";
import api from "@/api/api";

import {
  BookOpen,
  Heart,
  Share2,
  Loader2,
  Globe,
  Edit3,
  Trash2,
  X
} from "lucide-react";

const MOODS = ["Amazing", "Great", "Good", "Neutral", "Challenging"];
const MOOD_EMOJIS = {
  Amazing: "🤩",
  Great: "😊",
  Good: "🙂",
  Neutral: "😐",
  Challenging: "😅"
};

/* =========================
   JOURNAL CARD
========================= */

function JournalCard({ entry, onDelete }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="rounded-3xl overflow-hidden card-glass group hover:shadow-xl transition-all duration-300">

      {entry.cover_image && (
        <div className="h-52 overflow-hidden">
          <img
            src={entry.cover_image}
            alt={entry.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-6">

        <div className="flex items-start justify-between mb-3">
          <div>
            {entry.mood && (
              <span className="text-2xl mr-2">
                {MOOD_EMOJIS[entry.mood]}
              </span>
            )}

            <h3 className="font-bold text-lg inline">
              {entry.title}
            </h3>
          </div>

          <button
            onClick={() => onDelete(entry._id)}   // ✅ Mongo id
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">
            {entry.destination_name}
          </span>

          {entry.travel_date && (
            <>
              <span>·</span>
              <span className="text-sm">
                {new Date(entry.travel_date).toLocaleDateString()}
              </span>
            </>
          )}
        </div>

        <p className="text-sm leading-relaxed mb-4 line-clamp-3">
          {entry.content}
        </p>

        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {entry.tags.map(tag => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-2 text-sm"
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            {(entry.likes || 0) + (liked ? 1 : 0)}
          </button>

          <button className="flex items-center gap-2 text-sm">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   WRITE MODAL (UNCHANGED UI)
========================= */

function WriteJournalModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    destination_name: "",
    content: "",
    travel_date: "",
    mood: "Great",
    tags: "",
    cover_image: "",
    is_public: true,
    rating: 5
  });

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!form.title || !form.destination_name) return;

    setLoading(true);

    await onCreate({
      ...form,
      tags: form.tags
        ? form.tags.split(",").map(t => t.trim())
        : []
    });

    setLoading(false);
    onClose();
  };

  return (
    /* 👉 Modal UI unchanged */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* same modal JSX you already had */}
    </div>
  );
}

/* =========================
   MAIN PAGE
========================= */

export default function Journal() {

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState("all");

  /* ===== LOAD JOURNALS ===== */

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await api.get("/journals");
        setEntries(res.data || []);
      } catch (err) {
        console.error("Failed loading journals");
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  /* ===== CREATE ===== */

  const handleCreate = async (form) => {
    try {
      const res = await api.post("/journals", form);
      setEntries(prev => [res.data, ...prev]);
    } catch {
      console.error("Create failed");
    }
  };

  /* ===== DELETE ===== */

  const handleDelete = async (id) => {
    try {
      await api.delete(`/journals/${id}`);
      setEntries(prev => prev.filter(e => e._id !== id));
    } catch {
      console.error("Delete failed");
    }
  };

  const filtered =
    tab === "mine"
      ? entries.filter(e => !e.is_public)
      : entries;

  return (
    <div className="min-h-screen">

      {/* HEADER (UNCHANGED) */}

      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex justify-between">
          <h1 className="text-4xl font-bold">My Travel Journal</h1>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Edit3 className="w-4 h-4" /> Write Entry
          </button>
        </div>
      </div>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4" />
            <h3>No journal entries yet</h3>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map(entry => (
              <div key={entry._id} className="break-inside-avoid">
                <JournalCard
                  entry={entry}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <WriteJournalModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}