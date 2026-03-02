import { useState, useEffect } from "react";

import HeroSection from "../components/discover/HeroSection";
import DestinationCard from "../components/discover/DestinationCard";
import FeaturedDeals from "../components/discover/FeaturedDeals";

import {
  Sparkles,
  TrendingUp,
  Globe,
  ArrowRight,
  Loader2,
  Star,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "@/api/api";

const TRAVEL_STATS = [
  { icon: Globe, value: "1,200+", label: "Destinations" },
  { icon: Users, value: "500K+", label: "Travelers" },
  { icon: Star, value: "4.9/5", label: "Avg Rating" },
];

export default function Discover() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // 🔥 Fetch destinations from backend
      const destRes = await api.get("/destinations?page=1&limit=12");
      setDestinations(destRes.data || []);

      // 🔥 Fetch logged-in user (if exists)
      try {
        const userRes = await api.get("/auth/me");
        setUser(userRes.data.user);
      } catch {
        setUser(null);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const featuredDests = destinations.filter((d) => d.featured).slice(0, 6);
  const trendingDests = destinations.slice(0, 8);

  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      <HeroSection />

      {/* Stats Banner */}
      <div
        className="py-10 px-6"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderTop: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="max-w-4xl mx-auto flex justify-around">
          {TRAVEL_STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "var(--accent-soft)" }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: "var(--accent)" }}
                />
              </div>
              <div>
                <p
                  className="text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {value}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Recommendations */}
      {user && (
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles
                  className="w-4 h-4"
                  style={{ color: "var(--accent)" }}
                />
                <span
                  className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: "var(--accent)" }}
                >
                  Curated for You
                </span>
              </div>
              <h2
                className="text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Hello, {user.full_name?.split(" ")[0] || "Explorer"} 👋
              </h2>
              <p
                className="mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Based on your travel style, here are your top picks
              </p>
            </div>

            <Link
              to="/destinations"
              className="hidden md:flex items-center gap-2 text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingDests.slice(0, 4).map((dest) => (
                <DestinationCard
                  key={dest._id}
                  destination={dest}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Trending Destinations */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp
                className="w-4 h-4"
                style={{ color: "var(--accent)" }}
              />
              <span
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                Trending Now
              </span>
            </div>
            <h2
              className="text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Popular Destinations
            </h2>
          </div>

          <Link
            to="/destinations"
            className="hidden md:flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--accent)" }}
          >
            Explore all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20">
            <Globe
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "var(--text-muted)" }}
            />
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              No destinations yet
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Check back soon for amazing travel inspiration!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingDests.slice(0, 6).map((dest) => (
              <DestinationCard
                key={dest._id}
                destination={dest}
              />
            ))}
          </div>
        )}
      </section>

      <FeaturedDeals />

      {/* Travel Inspiration Banner */}
      <section className="py-16 px-6 my-8 max-w-7xl mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=1200&q=80"
            alt="Travel"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />

          <div className="relative z-10 px-8 md:px-16 py-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of thousands of travelers discovering unforgettable destinations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/destinations"
                className="px-8 py-4 rounded-2xl font-semibold text-white btn-primary"
              >
                Explore Destinations
              </Link>

              <Link
                to="/plan-trip"
                className="px-8 py-4 rounded-2xl font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                Plan a Trip
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}