import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import {
  Plus, Map, Calendar, Users, Trash2, Edit, Loader2, ChevronRight,
  Flag, CheckCircle, Clock, MapPin, DollarSign, Globe
} from "lucide-react";

const STATUS_COLORS = {
  planning: { bg: "var(--accent-soft)", text: "var(--accent)", label: "Planning" },
  confirmed: { bg: "var(--accent-2-soft)", text: "var(--accent-2)", label: "Confirmed" },
  completed: { bg: "#f0fdf4", text: "#16a34a", label: "Completed" },
  cancelled: { bg: "#fef2f2", text: "#dc2626", label: "Cancelled" },
};

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
            <h3 className="text-lg font-bold mt-2" style={{ color: "var(--text-primary)" }}>{trip.title}</h3>
          </div>
          <button onClick={() => onDelete(trip.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-red-50">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {trip.start_date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {new Date(trip.start_date).toLocaleDateString()} - {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : "TBD"}
              </span>
            </div>
          )}
          {trip.total_travelers && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{trip.total_travelers} traveler{trip.total_travelers > 1 ? "s" : ""}</span>
            </div>
          )}
          {trip.destinations?.length > 0 && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {trip.destinations.map(d => d.name).join(" → ")}
              </span>
            </div>
          )}
          {trip.total_budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Budget: ${trip.total_budget.toLocaleString()}</span>
            </div>
          )}
        </div>

        <Link to={createPageUrl(`TripDetail?id=${trip.id}`)}
          className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
          View itinerary <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function CreateTripModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "", start_date: "", end_date: "", total_travelers: 2, total_budget: "", notes: "", status: "planning"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg rounded-3xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)" }}>
        <div className="p-6 border-b" style={{ borderColor: "var(--border-color)" }}>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Create New Trip</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "var(--text-muted)" }}>Trip Name *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Summer in Southeast Asia"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "var(--text-muted)" }}>Start Date</label>
              <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "var(--text-muted)" }}>End Date</label>
              <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "var(--text-muted)" }}>Travelers</label>
              <input type="number" min="1" value={form.total_travelers} onChange={e => setForm({ ...form, total_travelers: +e.target.value })}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "var(--text-muted)" }}>Budget ($)</label>
              <input type="number" value={form.total_budget} onChange={e => setForm({ ...form, total_budget: +e.target.value })}
                placeholder="5000"
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "var(--text-muted)" }}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Any special plans or requirements..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
          </div>
        </div>
        <div className="p-6 flex gap-3 border-t" style={{ borderColor: "var(--border-color)" }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl text-sm font-medium"
            style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Cancel</button>
          <button onClick={handleCreate} disabled={!form.title || loading}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white btn-primary disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Trip"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlanTrip() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    base44.entities.TripPlan.list("-created_date", 50).then(data => {
      setTrips(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (form) => {
    const trip = await base44.entities.TripPlan.create(form);
    setTrips(prev => [trip, ...prev]);
  };

  const handleDelete = async (id) => {
    await base44.entities.TripPlan.delete(id);
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const filtered = activeTab === "all" ? trips : trips.filter(t => t.status === activeTab);

  const TABS = [
    { key: "all", label: "All Trips" },
    { key: "planning", label: "Planning" },
    { key: "confirmed", label: "Confirmed" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="py-16 px-6" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-5 h-5" style={{ color: "var(--accent)" }} />
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>Trip Planner</span>
            </div>
            <h1 className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>My Trips</h1>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Plan and organize your dream adventures</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white btn-primary">
            <Plus className="w-4 h-4" /> New Trip
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab.key ? "var(--accent)" : "var(--bg-card)",
                color: activeTab === tab.key ? "white" : "var(--text-secondary)",
                border: "1px solid var(--border-color)"
              }}>{tab.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Globe className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>No trips yet</h3>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>Start planning your next adventure!</p>
            <button onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-2xl text-sm font-semibold text-white btn-primary">
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(trip => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showModal && <CreateTripModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
}