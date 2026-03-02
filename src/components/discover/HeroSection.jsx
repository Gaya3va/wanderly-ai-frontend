import { useState } from "react";
import { Search, MapPin, Sliders } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(createPageUrl(`Destinations?search=${encodeURIComponent(query)}`));
  };

  const moods = [
    { label: "🏖️ Beach", value: "beach" },
    { label: "🏔️ Adventure", value: "adventure" },
    { label: "🏛️ Culture", value: "culture" },
    { label: "🌿 Nature", value: "nature" },
    { label: "🍜 Food & Wine", value: "culinary" },
    { label: "🧘 Wellness", value: "wellness" },
  ];

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=80"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,15,30,0.6) 0%, rgba(15,15,30,0.4) 50%, rgba(15,15,30,0.85) 100%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 fade-in-up"
          style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Personalized for every explorer
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight fade-in-up" style={{ animationDelay: "0.1s" }}>
          Discover Your Next<br />
          <span className="text-gradient">Adventure</span>
        </h1>

        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: "0.2s" }}>
          AI-powered destination recommendations tailored to your travel style, budget, and dreams.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch}
          className="flex items-center gap-3 p-2 rounded-2xl mb-8 max-w-2xl mx-auto fade-in-up"
          style={{ backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 flex-1 px-3">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search destinations, experiences, or vibes..."
              className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
            />
          </div>
          <button type="submit"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white flex-shrink-0 btn-primary">
            Explore
          </button>
        </form>

        {/* Mood Tags */}
        <div className="flex flex-wrap justify-center gap-3 fade-in-up" style={{ animationDelay: "0.4s" }}>
          {moods.map(({ label, value }) => (
            <button key={value}
              onClick={() => navigate(createPageUrl(`Destinations?type=${value}`))}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs">Scroll to explore</span>
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1">
          <div className="w-1 h-2 rounded-full bg-white/60" style={{ animation: "float 1.5s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}