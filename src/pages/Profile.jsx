import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import {
  User, Edit3, MapPin, BookOpen, Map, Globe, Star, Heart, Loader2,
  Settings, Camera, Save, X
} from "lucide-react";

const TRAVEL_STYLES = ["Adventure", "Culture", "Beach", "Nature", "Culinary", "Wellness", "History", "City", "Photography", "Backpacking"];
const CLIMATES = ["Tropical", "Desert", "Temperate", "Cold", "Mediterranean", "Monsoon"];
const CONTINENTS = ["Asia", "Europe", "Americas", "Africa", "Oceania", "Middle East"];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [journals, setJournals] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const u = await base44.auth.me();
      setUser(u);
      const [p, j, t] = await Promise.all([
        base44.entities.UserPreferences.filter({ user_email: u.email }, null, 1),
        base44.entities.TravelJournal.list("-created_date", 6),
        base44.entities.TripPlan.list("-created_date", 6),
      ]);
      setPrefs(p[0] || {});
      setJournals(j);
      setTrips(t);
    } catch {
      base44.auth.redirectToLogin(createPageUrl("Profile"));
    }
    setLoading(false);
  };

  const startEditing = () => {
    setEditForm({
      bio: prefs?.bio || "",
      travel_styles: prefs?.travel_styles || [],
      preferred_climates: prefs?.preferred_climates || [],
      preferred_continents: prefs?.preferred_continents || [],
      budget_range: prefs?.budget_range || "mid-range",
    });
    setEditing(true);
  };

  const toggleArrayItem = (field, item) => {
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field]?.includes(item)
        ? prev[field].filter(i => i !== item)
        : [...(prev[field] || []), item]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...editForm, user_email: user.email };
    if (prefs?.id) {
      const updated = await base44.entities.UserPreferences.update(prefs.id, data);
      setPrefs(updated);
    } else {
      const created = await base44.entities.UserPreferences.create(data);
      setPrefs(created);
    }
    setSaving(false);
    setEditing(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Profile Hero */}
      <div className="relative h-48 md:h-64" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80"
          alt="cover" className="w-full h-full object-cover opacity-30" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="-mt-16 mb-8 flex items-end justify-between">
          <div className="flex items-end gap-4">
            <div className="w-28 h-28 rounded-2xl border-4 flex items-center justify-center text-3xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", borderColor: "var(--bg-primary)" }}>
              {user.full_name?.[0] || user.email?.[0] || "U"}
            </div>
            <div className="mb-2">
              <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{user.full_name || "Explorer"}</h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{user.email}</p>
              {prefs?.bio && <p className="text-sm mt-1 max-w-md" style={{ color: "var(--text-secondary)" }}>{prefs.bio}</p>}
            </div>
          </div>
          <button onClick={startEditing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Journals", value: journals.length, icon: BookOpen },
            { label: "Trips", value: trips.length, icon: Map },
            { label: "Saved Destinations", value: prefs?.saved_destinations?.length || 0, icon: Heart },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-5 rounded-2xl text-center card-glass">
              <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--accent)" }} />
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide">
          {["overview", "journals", "trips"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all"
              style={{
                backgroundColor: activeTab === tab ? "var(--accent)" : "var(--bg-card)",
                color: activeTab === tab ? "white" : "var(--text-secondary)",
                border: "1px solid var(--border-color)"
              }}>{tab}</button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6 pb-16">
            {prefs?.travel_styles?.length > 0 && (
              <div className="p-6 rounded-3xl card-glass">
                <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Travel Style</h3>
                <div className="flex flex-wrap gap-2">
                  {prefs.travel_styles.map(s => (
                    <span key={s} className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {prefs?.preferred_continents?.length > 0 && (
              <div className="p-6 rounded-3xl card-glass">
                <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Dream Destinations</h3>
                <div className="flex flex-wrap gap-2">
                  {prefs.preferred_continents.map(c => (
                    <span key={c} className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "var(--accent-2-soft)", color: "var(--accent-2)" }}>{c}</span>
                  ))}
                </div>
              </div>
            )}
            {(!prefs?.travel_styles?.length && !prefs?.preferred_continents?.length) && (
              <div className="text-center py-12">
                <Globe className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                <p style={{ color: "var(--text-secondary)" }}>Complete your profile to get personalized recommendations</p>
                <button onClick={startEditing} className="mt-4 text-sm font-medium" style={{ color: "var(--accent)" }}>
                  Set Up Profile
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "journals" && (
          <div className="pb-16">
            {journals.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                <p className="mb-4" style={{ color: "var(--text-secondary)" }}>No journal entries yet</p>
                <Link to={createPageUrl("Journal")} className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                  Write your first entry →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {journals.map(entry => (
                  <div key={entry.id} className="p-5 rounded-2xl card-glass">
                    <h4 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{entry.title}</h4>
                    <p className="text-sm font-medium mb-2" style={{ color: "var(--accent)" }}>{entry.destination_name}</p>
                    <p className="text-sm line-clamp-2" style={{ color: "var(--text-secondary)" }}>{entry.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "trips" && (
          <div className="pb-16">
            {trips.length === 0 ? (
              <div className="text-center py-12">
                <Map className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                <p className="mb-4" style={{ color: "var(--text-secondary)" }}>No trips planned yet</p>
                <Link to={createPageUrl("PlanTrip")} className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                  Plan your first trip →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trips.map(trip => (
                  <div key={trip.id} className="p-5 rounded-2xl card-glass">
                    <h4 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{trip.title}</h4>
                    <p className="text-sm capitalize" style={{ color: "var(--accent)" }}>{trip.status}</p>
                    {trip.start_date && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {new Date(trip.start_date).toLocaleDateString()}
                    </p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-lg rounded-3xl overflow-hidden my-4" style={{ backgroundColor: "var(--bg-card)" }}>
            <div className="p-6 flex items-center justify-between border-b" style={{ borderColor: "var(--border-color)" }}>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Edit Profile</h2>
              <button onClick={() => setEditing(false)} className="p-2 rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <X className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
              </button>
            </div>
            <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "var(--text-muted)" }}>Bio</label>
                <textarea value={editForm.bio || ""} onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell other travelers about yourself..."
                  rows={3} className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                  style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "var(--text-muted)" }}>Travel Style</label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_STYLES.map(s => (
                    <button key={s} onClick={() => toggleArrayItem("travel_styles", s)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor: editForm.travel_styles?.includes(s) ? "var(--accent)" : "var(--bg-secondary)",
                        color: editForm.travel_styles?.includes(s) ? "white" : "var(--text-secondary)"
                      }}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "var(--text-muted)" }}>Preferred Continents</label>
                <div className="flex flex-wrap gap-2">
                  {CONTINENTS.map(c => (
                    <button key={c} onClick={() => toggleArrayItem("preferred_continents", c)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor: editForm.preferred_continents?.includes(c) ? "var(--accent-2)" : "var(--bg-secondary)",
                        color: editForm.preferred_continents?.includes(c) ? "white" : "var(--text-secondary)"
                      }}>{c}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "var(--text-muted)" }}>Budget Range</label>
                <div className="flex gap-2">
                  {["budget", "mid-range", "luxury"].map(b => (
                    <button key={b} onClick={() => setEditForm({ ...editForm, budget_range: b })}
                      className="flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all"
                      style={{
                        backgroundColor: editForm.budget_range === b ? "var(--accent-soft)" : "var(--bg-secondary)",
                        color: editForm.budget_range === b ? "var(--accent)" : "var(--text-secondary)",
                        border: editForm.budget_range === b ? "1.5px solid var(--accent)" : "1.5px solid transparent"
                      }}>{b}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 flex gap-3 border-t" style={{ borderColor: "var(--border-color)" }}>
              <button onClick={() => setEditing(false)} className="flex-1 py-3 rounded-2xl text-sm font-medium"
                style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white btn-primary flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}