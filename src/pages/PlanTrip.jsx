import { useState, useEffect } from "react";
import api from "@/api/api";
import { Link } from "react-router-dom";
import {
  Plus, Map, Calendar, Users, Trash2, Loader2, ChevronRight,
  MapPin, DollarSign, Globe
} from "lucide-react";

const STATUS_COLORS = {
  planning: { bg: "var(--accent-soft)", text: "var(--accent)", label: "Planning" },
  confirmed: { bg: "var(--accent-2-soft)", text: "var(--accent-2)", label: "Confirmed" },
  completed: { bg: "#f0fdf4", text: "#16a34a", label: "Completed" },
  cancelled: { bg: "#fef2f2", text: "#dc2626", label: "Cancelled" },
};

/* ================================
   TRIP CARD
================================ */

function TripCard({ trip, onDelete }) {
  const status = STATUS_COLORS[trip.status] || STATUS_COLORS.planning;

  return (
    <div className="rounded-3xl overflow-hidden card-glass hover:shadow-xl transition-all duration-300 group">
      <div className="h-2 w-full" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: status.bg, color: status.text }}>
              {status.label}
            </span>

            <h3 className="text-lg font-bold mt-2" style={{ color: "var(--text-primary)" }}>
              {trip.title}
            </h3>
          </div>

          <button
            onClick={() => onDelete(trip._id)}   // ✅ Mongo ID
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {trip.start_date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(trip.start_date).toLocaleDateString()} -
                {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : " TBD"}
              </span>
            </div>
          )}

          {trip.total_travelers && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {trip.total_travelers} traveler{trip.total_travelers > 1 ? "s" : ""}
              </span>
            </div>
          )}

          {trip.total_budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">
                Budget: ${trip.total_budget.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <Link
          to={`/trip/${trip._id}`}   // ✅ direct route
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--accent)" }}
        >
          View itinerary <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/* ================================
   CREATE TRIP MODAL
================================ */

function CreateTripModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    start_date: "",
    end_date: "",
    total_travelers: 2,
    total_budget: "",
    notes: "",
    status: "planning",
  });

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!form.title) return;

    setLoading(true);
    await onCreate(form);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>

      <div className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)" }}>

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Create New Trip</h2>
        </div>

        <div className="p-6 space-y-4">
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Trip Name"
            className="w-full px-4 py-3 rounded-2xl border"
          />

          <input
            type="date"
            value={form.start_date}
            onChange={e => setForm({ ...form, start_date: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border"
          />

          <input
            type="number"
            value={form.total_travelers}
            onChange={e => setForm({ ...form, total_travelers: +e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border"
          />

          <input
            type="number"
            value={form.total_budget}
            onChange={e => setForm({ ...form, total_budget: +e.target.value })}
            placeholder="Budget"
            className="w-full px-4 py-3 rounded-2xl border"
          />
        </div>

        <div className="p-6 flex gap-3 border-t">
          <button onClick={onClose} className="flex-1 py-3 border rounded-2xl">
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={!form.title || loading}
            className="flex-1 py-3 rounded-2xl text-white bg-black flex justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Trip"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================
   MAIN PAGE
================================ */

export default function PlanTrip() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  /* =========================
     LOAD FROM BACKEND
  ========================= */

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/trips");
        setTrips(res.data || []);
      } catch (err) {
        console.error("Failed to fetch trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  /* =========================
     CREATE
  ========================= */

  const handleCreate = async (form) => {
    try {
      const res = await api.post("/trips", form);
      setTrips(prev => [res.data, ...prev]);
    } catch (err) {
      console.error("Create failed");
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    try {
      await api.delete(`/trips/${id}`);
      setTrips(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const filtered =
    activeTab === "all"
      ? trips
      : trips.filter(t => t.status === activeTab);

  return (
    <div className="min-h-screen">

      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">My Trips</h1>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white bg-black"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Globe className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No trips yet</h3>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-2xl text-white bg-black"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(trip => (
              <TripCard
                key={trip._id}
                trip={trip}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateTripModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}