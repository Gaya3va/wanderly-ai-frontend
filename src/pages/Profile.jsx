import { useState, useEffect } from "react";
import api from "@/api/api";
import { Link, useNavigate } from "react-router-dom";
import {
  Edit3, BookOpen, Map, Globe, Heart,
  Loader2, Save, X
} from "lucide-react";

const TRAVEL_STYLES = ["Adventure", "Culture", "Beach", "Nature", "Culinary", "Wellness", "History", "City", "Photography", "Backpacking"];
const CONTINENTS = ["Asia", "Europe", "Americas", "Africa", "Oceania", "Middle East"];

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [prefs, setPrefs] = useState({});
  const [journals, setJournals] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  /* ============================
      LOAD DATA FROM BACKEND
  ============================ */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const userRes = await api.get("/auth/me");
        setUser(userRes.data.user);

        const [prefRes, journalRes, tripRes] = await Promise.all([
          api.get("/preferences"),
          api.get("/journals?limit=6"),
          api.get("/trips?limit=6")
        ]);

        setPrefs(prefRes.data || {});
        setJournals(journalRes.data || []);
        setTrips(tripRes.data || []);

      } catch (err) {
        navigate("/auth"); // redirect to login
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  /* ============================
      EDIT PROFILE
  ============================ */

  const startEditing = () => {
    setEditForm({
      bio: prefs?.bio || "",
      travel_styles: prefs?.travel_styles || [],
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
    try {
      setSaving(true);

      if (prefs?._id) {
        const res = await api.put(`/preferences/${prefs._id}`, editForm);
        setPrefs(res.data);
      } else {
        const res = await api.post("/preferences", editForm);
        setPrefs(res.data);
      }

      setEditing(false);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  /* ============================
      LOADING
  ============================ */

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  if (!user) return null;

  /* ============================
      UI (UNCHANGED)
  ============================ */

  return (
    <div className="min-h-screen">

      {/* PROFILE HEADER */}
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              {user.full_name || "Explorer"}
            </h1>
            <p className="text-sm text-gray-500">
              {user.email}
            </p>
            {prefs?.bio && (
              <p className="mt-2 text-sm">
                {prefs.bio}
              </p>
            )}
          </div>

          <button
            onClick={startEditing}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="p-5 text-center border rounded-xl">
            <BookOpen className="w-5 h-5 mx-auto mb-2" />
            <p className="text-xl font-bold">{journals.length}</p>
            <p className="text-xs">Journals</p>
          </div>

          <div className="p-5 text-center border rounded-xl">
            <Map className="w-5 h-5 mx-auto mb-2" />
            <p className="text-xl font-bold">{trips.length}</p>
            <p className="text-xs">Trips</p>
          </div>

          <div className="p-5 text-center border rounded-xl">
            <Heart className="w-5 h-5 mx-auto mb-2" />
            <p className="text-xl font-bold">
              {prefs?.saved_destinations?.length || 0}
            </p>
            <p className="text-xs">Saved</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6">
          {["overview", "journals", "trips"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab ? "bg-black text-white" : "border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* JOURNALS */}
        {activeTab === "journals" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {journals.map(entry => (
              <div key={entry._id} className="p-4 border rounded-xl">
                <h4 className="font-semibold">{entry.title}</h4>
                <p className="text-sm">{entry.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* TRIPS */}
        {activeTab === "trips" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trips.map(trip => (
              <div key={trip._id} className="p-4 border rounded-xl">
                <h4 className="font-semibold">{trip.title}</h4>
                <p className="text-sm capitalize">{trip.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl">

            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>

            <textarea
              value={editForm.bio}
              onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full border p-3 rounded-xl mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 border py-2 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex-1 bg-black text-white py-2 rounded-xl flex justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}