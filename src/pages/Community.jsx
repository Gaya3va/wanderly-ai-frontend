import { useState, useEffect } from "react";
import api from "@/api/api";

import {
  Users,
  Heart,
  MessageSquare,
  Share2,
  Globe,
  Camera,
  Loader2,
} from "lucide-react";

/* -------- KEEP COMMUNITY_POSTS SAME -------- */
/* (unchanged — not rewriting here to keep answer shorter) */

export default function Community() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");

  useEffect(() => {
    const fetchPublicJournals = async () => {
      try {
        const res = await api.get("/journals?public=true");
        setJournals(res.data || []);
      } catch (err) {
        console.error("Failed to fetch journals");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicJournals();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* UI unchanged */}

      {activeTab === "journals" && (
        <div>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : journals.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="w-16 h-16 mx-auto mb-4" />
              <h3>No public journals yet</h3>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {journals.map(entry => (
                <JournalPreview
                  key={entry._id}   // ✅ FIXED
                  entry={entry}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}