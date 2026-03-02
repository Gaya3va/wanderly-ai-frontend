import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import DestinationCard from "../components/discover/DestinationCard";
import { Search, SlidersHorizontal, X, Loader2, Globe, Map } from "lucide-react";

const CONTINENTS = ["All", "Asia", "Europe", "Americas", "Africa", "Oceania", "Middle East"];
const TRAVEL_TYPES = ["adventure", "culture", "beach", "nature", "culinary", "wellness", "history", "city"];
const CLIMATES = ["Tropical", "Desert", "Temperate", "Cold", "Mediterranean", "Monsoon"];
const BUDGETS = [
  { label: "Budget (< $100/day)", value: "budget", max: 100 },
  { label: "Mid-range ($100-250/day)", value: "mid", max: 250 },
  { label: "Luxury ($250+/day)", value: "luxury", max: 99999 },
];

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("search") || "";
  });
  const [continent, setContinent] = useState("All");
  const [selectedTypes, setSelectedTypes] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    return type ? [type] : [];
  });
  const [climate, setClimate] = useState("");
  const [budget, setBudget] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    base44.entities.Destination.list("-rating", 100).then(data => {
      setDestinations(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...destinations];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.country?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (continent !== "All") result = result.filter(d => d.continent === continent);
    if (selectedTypes.length > 0) result = result.filter(d =>
      selectedTypes.some(t => d.travel_types?.includes(t))
    );
    if (climate) result = result.filter(d => d.climate === climate);
    if (budget) {
      const budgetObj = BUDGETS.find(b => b.value === budget);
      if (budgetObj) result = result.filter(d => (d.avg_budget_per_day || 0) <= budgetObj.max);
    }
    if (sortBy === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "price_asc") result.sort((a, b) => (a.flight_cost_estimate || 0) - (b.flight_cost_estimate || 0));
    if (sortBy === "price_desc") result.sort((a, b) => (b.flight_cost_estimate || 0) - (a.flight_cost_estimate || 0));
    setFiltered(result);
  }, [destinations, search, continent, selectedTypes, climate, budget, sortBy]);

  const toggleType = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const clearFilters = () => {
    setSearch(""); setContinent("All"); setSelectedTypes([]); setClimate(""); setBudget("");
  };

  const activeFilterCount = (continent !== "All" ? 1 : 0) + selectedTypes.length + (climate ? 1 : 0) + (budget ? 1 : 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <div className="py-16 px-6 text-center" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Globe className="w-5 h-5" style={{ color: "var(--accent)" }} />
          <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>Explore the World</span>
        </div>
        <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>All Destinations</h1>
        <p style={{ color: "var(--text-secondary)" }}>Discover {destinations.length}+ handpicked destinations</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none"
              style={{ backgroundColor: "var(--bg-card)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ backgroundColor: "var(--bg-card)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }}>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all"
            style={{
              backgroundColor: showFilters ? "var(--accent)" : "var(--bg-card)",
              color: showFilters ? "white" : "var(--text-primary)",
              border: "1.5px solid var(--border-color)"
            }}>
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ backgroundColor: showFilters ? "rgba(255,255,255,0.3)" : "var(--accent)", color: showFilters ? "white" : "white" }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 rounded-3xl card-glass">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Continent</p>
                <div className="flex flex-wrap gap-2">
                  {CONTINENTS.map(c => (
                    <button key={c} onClick={() => setContinent(c)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor: continent === c ? "var(--accent)" : "var(--bg-secondary)",
                        color: continent === c ? "white" : "var(--text-secondary)"
                      }}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Travel Style</p>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_TYPES.map(type => (
                    <button key={type} onClick={() => toggleType(type)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all"
                      style={{
                        backgroundColor: selectedTypes.includes(type) ? "var(--accent-2)" : "var(--bg-secondary)",
                        color: selectedTypes.includes(type) ? "white" : "var(--text-secondary)"
                      }}>{type}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Climate</p>
                <div className="flex flex-wrap gap-2">
                  {CLIMATES.map(c => (
                    <button key={c} onClick={() => setClimate(climate === c ? "" : c)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor: climate === c ? "var(--accent-2)" : "var(--bg-secondary)",
                        color: climate === c ? "white" : "var(--text-secondary)"
                      }}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Budget</p>
                <div className="space-y-2">
                  {BUDGETS.map(b => (
                    <button key={b.value} onClick={() => setBudget(budget === b.value ? "" : b.value)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{
                        backgroundColor: budget === b.value ? "var(--accent-soft)" : "var(--bg-secondary)",
                        color: budget === b.value ? "var(--accent)" : "var(--text-secondary)"
                      }}>{b.label}</button>
                  ))}
                </div>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters}
                className="mt-4 flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
                <X className="w-3 h-3" /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Continent Quick Tabs */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-8 pb-1">
          {CONTINENTS.map(c => (
            <button key={c} onClick={() => setContinent(c)}
              className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: continent === c ? "var(--accent)" : "var(--bg-card)",
                color: continent === c ? "white" : "var(--text-secondary)",
                border: "1px solid var(--border-color)"
              }}>{c}</button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Map className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>No destinations found</h3>
            <p style={{ color: "var(--text-secondary)" }}>Try adjusting your filters</p>
            <button onClick={clearFilters} className="mt-4 text-sm font-medium" style={{ color: "var(--accent)" }}>Clear filters</button>
          </div>
        ) : (
          <>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Showing {filtered.length} destination{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(dest => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}